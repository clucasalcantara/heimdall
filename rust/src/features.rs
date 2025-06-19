use anyhow::Result;
use chrono::{Timelike, Datelike};
use sha2::{Sha256, Digest};

use crate::models::{Transaction, Feature, PaymentMethod};

pub struct FeatureExtractor {
    // In a real system, you might have database connections or external services here
}

impl FeatureExtractor {
    pub async fn new() -> Result<Self> {
        Ok(Self {})
    }

    pub async fn extract_features(&self, transaction: &Transaction) -> Result<Vec<Feature>> {
        let mut features = Vec::new();

        // Amount-based features
        features.push(Feature {
            name: "amount".to_string(),
            value: transaction.amount,
            importance: 0.8,
        });

        features.push(Feature {
            name: "amount_log".to_string(),
            value: transaction.amount.ln(),
            importance: 0.7,
        });

        // Time-based features
        let hour = transaction.timestamp.hour() as f64;
        features.push(Feature {
            name: "hour_of_day".to_string(),
            value: hour,
            importance: 0.5,
        });

        let day_of_week = transaction.timestamp.weekday().num_days_from_sunday() as f64;
        features.push(Feature {
            name: "day_of_week".to_string(),
            value: day_of_week,
            importance: 0.4,
        });

        // Cyclical time features
        features.push(Feature {
            name: "hour_sin".to_string(),
            value: (hour * 2.0 * std::f64::consts::PI / 24.0).sin(),
            importance: 0.3,
        });

        features.push(Feature {
            name: "hour_cos".to_string(),
            value: (hour * 2.0 * std::f64::consts::PI / 24.0).cos(),
            importance: 0.3,
        });

        // Payment method features
        let (payment_type, card_brand) = match &transaction.payment_method {
            PaymentMethod::CreditCard { brand, .. } => (1.0, self.encode_card_brand(brand)),
            PaymentMethod::DebitCard { brand, .. } => (2.0, self.encode_card_brand(brand)),
            PaymentMethod::BankTransfer => (3.0, 0.0),
            PaymentMethod::DigitalWallet { .. } => (4.0, 0.0),
        };

        features.push(Feature {
            name: "payment_type".to_string(),
            value: payment_type,
            importance: 0.6,
        });

        features.push(Feature {
            name: "card_brand".to_string(),
            value: card_brand,
            importance: 0.4,
        });

        // Geographic features
        features.push(Feature {
            name: "country_risk".to_string(),
            value: self.get_country_risk_score(&transaction.billing_address.country),
            importance: 0.7,
        });

        // Address matching
        let address_match = if let Some(shipping) = &transaction.shipping_address {
            if shipping.country == transaction.billing_address.country { 1.0 } else { 0.0 }
        } else {
            0.5 // No shipping address provided
        };

        features.push(Feature {
            name: "address_country_match".to_string(),
            value: address_match,
            importance: 0.5,
        });

        // Email domain features
        let email_domain = transaction.email.split('@').nth(1).unwrap_or("");
        features.push(Feature {
            name: "email_domain_risk".to_string(),
            value: self.get_email_domain_risk(email_domain),
            importance: 0.6,
        });

        // Device fingerprint hash (if available)
        if let Some(fingerprint) = &transaction.device_fingerprint {
            features.push(Feature {
                name: "device_fingerprint_hash".to_string(),
                value: self.hash_to_float(fingerprint),
                importance: 0.5,
            });
        }

        // User agent features (if available)
        if let Some(user_agent) = &transaction.user_agent {
            features.push(Feature {
                name: "user_agent_risk".to_string(),
                value: self.analyze_user_agent(user_agent),
                importance: 0.3,
            });
        }

        // Merchant category risk
        features.push(Feature {
            name: "merchant_category_risk".to_string(),
            value: self.get_merchant_category_risk(&transaction.merchant_category),
            importance: 0.5,
        });

        // Currency features
        features.push(Feature {
            name: "currency_risk".to_string(),
            value: self.get_currency_risk(&transaction.currency),
            importance: 0.4,
        });

        Ok(features)
    }

    fn encode_card_brand(&self, brand: &str) -> f64 {
        match brand.to_lowercase().as_str() {
            "visa" => 1.0,
            "mastercard" => 2.0,
            "amex" | "american express" => 3.0,
            "discover" => 4.0,
            _ => 0.0,
        }
    }

    fn get_country_risk_score(&self, country: &str) -> f64 {
        // Simplified risk scoring - in reality, this would be based on fraud statistics
        let high_risk_countries = ["XX", "YY", "ZZ"]; // Example country codes
        if high_risk_countries.contains(&country) {
            0.8
        } else {
            match country {
                "US" | "CA" | "GB" | "DE" | "FR" => 0.1,
                _ => 0.3,
            }
        }
    }

    fn get_email_domain_risk(&self, domain: &str) -> f64 {
        let trusted_domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
        let suspicious_domains = ["tempmail.com", "10minutemail.com"];
        
        if suspicious_domains.contains(&domain) {
            0.9
        } else if trusted_domains.contains(&domain) {
            0.1
        } else {
            0.3
        }
    }

    fn hash_to_float(&self, input: &str) -> f64 {
        let mut hasher = Sha256::new();
        hasher.update(input.as_bytes());
        let result = hasher.finalize();
        
        // Convert first 8 bytes to u64, then normalize to 0-1
        let mut bytes = [0u8; 8];
        bytes.copy_from_slice(&result[0..8]);
        let hash_value = u64::from_be_bytes(bytes);
        
        hash_value as f64 / u64::MAX as f64
    }

    fn analyze_user_agent(&self, user_agent: &str) -> f64 {
        // Simple user agent analysis
        if user_agent.is_empty() {
            return 0.8;
        }
        
        if user_agent.contains("bot") || user_agent.contains("crawler") {
            return 0.9;
        }
        
        // Check for common browsers
        if user_agent.contains("Chrome") || user_agent.contains("Firefox") || user_agent.contains("Safari") {
            0.1
        } else {
            0.4
        }
    }

    fn get_merchant_category_risk(&self, category: &str) -> f64 {
        match category.to_lowercase().as_str() {
            "gambling" | "adult" | "cryptocurrency" => 0.8,
            "electronics" | "jewelry" => 0.6,
            "grocery" | "gas_station" => 0.1,
            _ => 0.3,
        }
    }

    fn get_currency_risk(&self, currency: &str) -> f64 {
        match currency.to_uppercase().as_str() {
            "USD" | "EUR" | "GBP" | "CAD" => 0.1,
            "BTC" | "ETH" => 0.7,
            _ => 0.3,
        }
    }
}
