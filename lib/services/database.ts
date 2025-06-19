import type {
  FeedbackDocument,
  FraudAnalysisDocument,
  TransactionDocument,
} from "../models/transaction";

import { COLLECTION_INDEXES } from "../models/transaction";
import { getDatabase } from "../mongodb";

export class DatabaseService {
  private static instance: DatabaseService;
  private initialized = false;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    const db = await getDatabase();

    // Create indexes for optimal performance
    for (const [collectionName, indexes] of Object.entries(
      COLLECTION_INDEXES
    )) {
      const collection = db.collection(collectionName);
      for (const index of indexes) {
        try {
          await collection.createIndex(index.key, {
            unique: index.unique || false,
            background: true,
          });
        } catch (error) {
          console.warn(`Failed to create index for ${collectionName}:`, error);
        }
      }
    }

    this.initialized = true;
    console.log("Database initialized with indexes");
  }

  // Transaction operations
  async saveTransaction(
    transaction: Omit<TransactionDocument, "_id" | "created_at" | "updated_at">
  ) {
    const db = await getDatabase();
    const now = new Date();

    const doc: TransactionDocument = {
      ...transaction,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection("transactions").insertOne(doc);
    return result.insertedId;
  }

  async saveFraudAnalysis(
    analysis: Omit<FraudAnalysisDocument, "_id" | "created_at">
  ) {
    const db = await getDatabase();

    const doc: FraudAnalysisDocument = {
      ...analysis,
      ml_model_version: "1.0.0",
      rules_engine_version: "1.0.0",
      created_at: new Date(),
    };

    const result = await db.collection("fraud_analysis").insertOne(doc);
    return result.insertedId;
  }

  // Get recent transactions with analysis
  async getRecentTransactions(limit = 50, offset = 0) {
    const db = await getDatabase();

    const pipeline = [
      {
        $lookup: {
          from: "fraud_analysis",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "analysis",
        },
      },
      {
        $unwind: "$analysis",
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ];

    return await db.collection("transactions").aggregate(pipeline).toArray();
  }

  // Get transactions by risk level
  async getTransactionsByRisk(riskLevel: string, limit = 20) {
    const db = await getDatabase();

    const pipeline = [
      {
        $lookup: {
          from: "fraud_analysis",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "analysis",
        },
      },
      {
        $unwind: "$analysis",
      },
      {
        $match: { "analysis.risk_level": riskLevel },
      },
      {
        $sort: { "analysis.created_at": -1 },
      },
      {
        $limit: limit,
      },
    ];

    return await db.collection("transactions").aggregate(pipeline).toArray();
  }

  // User behavior tracking
  async updateUserBehavior(
    userId: string,
    transaction: TransactionDocument,
    riskScore: number
  ) {
    const db = await getDatabase();
    const now = new Date();

    await db.collection("user_behavior").updateOne(
      { user_id: userId },
      {
        $inc: {
          total_transactions: 1,
          total_amount: transaction.amount,
        },
        $set: {
          last_transaction: transaction.timestamp,
          updated_at: now,
        },
        $addToSet: {
          countries_used: transaction.billing_address.country,
          merchants_used: transaction.merchant_id,
          payment_methods_used: transaction.payment_method.type,
        },
        $push: {
          fraud_score_history: {
            $each: [{ score: riskScore, timestamp: now }],
            $slice: -100, // Keep last 100 scores
          },
        },
        $setOnInsert: {
          first_transaction: transaction.timestamp,
          created_at: now,
        },
      },
      { upsert: true }
    );

    // Update average amount
    const userDoc = await db
      .collection("user_behavior")
      .findOne({ user_id: userId });
    if (userDoc) {
      const avgAmount = userDoc.total_amount / userDoc.total_transactions;
      await db
        .collection("user_behavior")
        .updateOne({ user_id: userId }, { $set: { avg_amount: avgAmount } });
    }
  }

  // IP behavior tracking
  async updateIPBehavior(ipAddress: string, userId: string, riskScore: number) {
    const db = await getDatabase();
    const now = new Date();

    await db.collection("ip_behavior").updateOne(
      { ip_address: ipAddress },
      {
        $inc: { total_transactions: 1 },
        $addToSet: {
          countries: userId, // This would be country in real implementation
        },
        $set: {
          last_seen: now,
          updated_at: now,
        },
        $setOnInsert: {
          first_seen: now,
          is_blacklisted: false,
          created_at: now,
        },
      },
      { upsert: true }
    );

    // Update average risk score
    const ipDoc = await db
      .collection("ip_behavior")
      .findOne({ ip_address: ipAddress });
    if (ipDoc) {
      const newAvg =
        ((ipDoc.avg_risk_score || 0) * (ipDoc.total_transactions - 1) +
          riskScore) /
        ipDoc.total_transactions;
      await db.collection("ip_behavior").updateOne(
        { ip_address: ipAddress },
        {
          $set: {
            avg_risk_score: newAvg,
            unique_users: ipDoc.countries?.length || 1,
          },
        }
      );
    }
  }

  // Dashboard statistics
  async getDashboardStats() {
    const db = await getDatabase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's stats
    const todayStats = await db
      .collection("system_stats")
      .findOne({ date: today });

    if (todayStats) {
      return todayStats;
    }

    // Calculate stats from transactions if no daily stats exist
    const pipeline = [
      {
        $lookup: {
          from: "fraud_analysis",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "analysis",
        },
      },
      {
        $unwind: "$analysis",
      },
      {
        $match: {
          timestamp: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          total_transactions: { $sum: 1 },
          approved_count: {
            $sum: {
              $cond: [{ $eq: ["$analysis.recommendation", "Approve"] }, 1, 0],
            },
          },
          reviewed_count: {
            $sum: {
              $cond: [{ $eq: ["$analysis.recommendation", "Review"] }, 1, 0],
            },
          },
          declined_count: {
            $sum: {
              $cond: [{ $eq: ["$analysis.recommendation", "Decline"] }, 1, 0],
            },
          },
          avg_processing_time: { $avg: "$analysis.processing_time_ms" },
          risk_low: {
            $sum: { $cond: [{ $eq: ["$analysis.risk_level", "Low"] }, 1, 0] },
          },
          risk_medium: {
            $sum: {
              $cond: [{ $eq: ["$analysis.risk_level", "Medium"] }, 1, 0],
            },
          },
          risk_high: {
            $sum: { $cond: [{ $eq: ["$analysis.risk_level", "High"] }, 1, 0] },
          },
          risk_critical: {
            $sum: {
              $cond: [{ $eq: ["$analysis.risk_level", "Critical"] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await db
      .collection("transactions")
      .aggregate(pipeline)
      .toArray();
    return (
      result[0] || {
        total_transactions: 0,
        approved_count: 0,
        reviewed_count: 0,
        declined_count: 0,
        fraud_rate: 0,
        avg_processing_time_ms: 0,
        risk_distribution: { low: 0, medium: 0, high: 0, critical: 0 },
      }
    );
  }

  // Country statistics
  async getCountryStats(limit = 10) {
    const db = await getDatabase();

    const pipeline = [
      {
        $lookup: {
          from: "fraud_analysis",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "analysis",
        },
      },
      {
        $unwind: "$analysis",
      },
      {
        $group: {
          _id: "$billing_address.country",
          transaction_count: { $sum: 1 },
          avg_risk_score: { $avg: "$analysis.overall_score" },
          total_amount: { $sum: "$amount" },
        },
      },
      {
        $match: {
          transaction_count: { $gte: 3 }, // Only countries with at least 3 transactions
        },
      },
      {
        $sort: { avg_risk_score: -1 },
      },
      {
        $limit: limit,
      },
    ];

    return await db.collection("transactions").aggregate(pipeline).toArray();
  }

  // Feedback operations
  async saveFeedback(feedback: Omit<FeedbackDocument, "_id" | "created_at">) {
    const db = await getDatabase();

    const doc: FeedbackDocument = {
      ...feedback,
      created_at: new Date(),
    };

    const result = await db.collection("feedback").insertOne(doc);
    return result.insertedId;
  }

  // Search transactions
  async searchTransactions(query: {
    user_id?: string;
    country?: string;
    risk_level?: string;
    recommendation?: string;
    date_from?: Date;
    date_to?: Date;
    limit?: number;
    offset?: number;
  }) {
    const db = await getDatabase();

    const matchConditions: any = {};

    if (query.user_id) matchConditions.user_id = query.user_id;
    if (query.country)
      matchConditions["billing_address.country"] = query.country;
    if (query.date_from || query.date_to) {
      matchConditions.timestamp = {};
      if (query.date_from) matchConditions.timestamp.$gte = query.date_from;
      if (query.date_to) matchConditions.timestamp.$lte = query.date_to;
    }

    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: "fraud_analysis",
          localField: "transaction_id",
          foreignField: "transaction_id",
          as: "analysis",
        },
      },
      {
        $unwind: "$analysis",
      },
    ];

    if (query.risk_level) {
      pipeline.push({ $match: { "analysis.risk_level": query.risk_level } });
    }

    if (query.recommendation) {
      pipeline.push({
        $match: { "analysis.recommendation": query.recommendation },
      });
    }

    pipeline.push(
      { $sort: { timestamp: -1 } },
      { $skip: query.offset || 0 },
      { $limit: query.limit || 50 }
    );

    return await db.collection("transactions").aggregate(pipeline).toArray();
  }
}

// Export singleton instance
export const dbService = DatabaseService.getInstance();
