"use client";

import {
  Activity,
  BarChart3,
  Brain,
  Clock,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Lock,
  Network,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Progress } from "@/components/ui/progress";
import type React from "react";

export default function ArchitecturePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sistema de Antifraude Inteligente"
        subheading="Arquitetura técnica completa e estratégias de implementação para detecção de fraude em tempo real"
      />

      {/* Performance Badges */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="bg-blue-900/20 text-blue-400">
          <Zap className="mr-1 h-3 w-3" />
          Latência &lt; 300ms
        </Badge>
        <Badge variant="outline" className="bg-green-900/20 text-green-400">
          <Target className="mr-1 h-3 w-3" />
          99.5% Precisão
        </Badge>
        <Badge variant="outline" className="bg-purple-900/20 text-purple-400">
          <Shield className="mr-1 h-3 w-3" />
          Híbrido ML + Regras
        </Badge>
        <Badge variant="outline" className="bg-orange-900/20 text-orange-400">
          <Activity className="mr-1 h-3 w-3" />
          Tempo Real
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="data-flow">Fluxo de Dados</TabsTrigger>
          <TabsTrigger value="ml-strategy">Estratégia ML</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SystemOverviewCard
              title="Core Engine"
              icon={Brain}
              description="Decision Engine híbrido com ML + Regras"
              metrics={[
                { label: "Latência Média", value: "127ms" },
                { label: "Throughput", value: "1,247 TPS" },
                { label: "Precisão", value: "99.5%" },
              ]}
            />
            <SystemOverviewCard
              title="API Gateway"
              icon={Globe}
              description="RESTful API com autenticação e rate limiting"
              metrics={[
                { label: "Endpoints", value: "12" },
                { label: "Rate Limit", value: "1000/min" },
                { label: "Uptime", value: "99.9%" },
              ]}
            />
            <SystemOverviewCard
              title="Data Pipeline"
              icon={Database}
              description="MongoDB com índices otimizados e agregações"
              metrics={[
                { label: "Collections", value: "7" },
                { label: "Índices", value: "23" },
                { label: "Retenção", value: "90 dias" },
              ]}
            />
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                <Shield className="mr-2 inline-block h-5 w-5 text-blue-400" />
                Arquitetura do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Globe className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                    <h4 className="text-white font-medium">Frontend</h4>
                    <p className="text-sm text-gray-400">Next.js 14 + React</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Cpu className="mx-auto h-8 w-8 text-green-400 mb-2" />
                    <h4 className="text-white font-medium">Backend</h4>
                    <p className="text-sm text-gray-400">
                      Node.js + TypeScript
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Database className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                    <h4 className="text-white font-medium">Database</h4>
                    <p className="text-sm text-gray-400">MongoDB Atlas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPONENTS */}
        <TabsContent value="components" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <ComponentCard
              title="Decision Engine"
              file="lib/decision-engine.ts"
              description="Motor principal de decisão que combina ML e regras"
              features={[
                "Análise híbrida (40% regras + 60% ML)",
                "Processamento em tempo real",
                "Sistema de confiança",
                "Explicabilidade das decisões",
              ]}
            />
            <ComponentCard
              title="Fraud Rules Engine"
              file="lib/fraud-rules.ts"
              description="Engine de regras determinísticas para detecção"
              features={[
                "50+ regras de fraude",
                "Categorização por severidade",
                "Blacklists dinâmicas",
                "Análise comportamental",
              ]}
            />
            <ComponentCard
              title="ML Model"
              file="lib/ml-model.ts"
              description="Modelo de machine learning para scoring"
              features={[
                "19 features engineered",
                "Modelo híbrido supervisionado",
                "Feature importance",
                "Cold-start handling",
              ]}
            />
            <ComponentCard
              title="Load Tester"
              file="lib/load-tester.ts"
              description="Sistema de teste de carga massiva"
              features={[
                "Testes de até 1M+ transações",
                "Métricas em tempo real",
                "Controle de concorrência",
                "Relatórios detalhados",
              ]}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ComponentCard
              title="Database Service"
              file="lib/services/database.ts"
              description="Camada de abstração para MongoDB"
              features={[
                "7 collections otimizadas",
                "23 índices compostos",
                "Agregações complexas",
                "Cleanup automático",
              ]}
            />
            <ComponentCard
              title="Logger System"
              file="lib/logger.ts"
              description="Sistema de logging estruturado"
              features={[
                "Logs em batch para performance",
                "4 níveis de log",
                "Subscribers em tempo real",
                "Cleanup automático",
              ]}
            />
          </div>
        </TabsContent>

        {/* DATA FLOW */}
        <TabsContent value="data-flow" className="space-y-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                <Network className="mr-2 inline-block h-5 w-5 text-blue-400" />
                Fluxo de Dados da Transação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <DataFlowStep
                  step={1}
                  title="Recepção da Transação"
                  description="API recebe transação via POST /api/analyze"
                  details={[
                    "Validação de schema",
                    "Rate limiting",
                    "Autenticação",
                  ]}
                />
                <DataFlowStep
                  step={2}
                  title="Análise de Regras"
                  description="FraudRulesEngine executa 50+ regras"
                  details={[
                    "Velocity checks",
                    "Blacklists",
                    "Geo-analysis",
                    "Behavioral patterns",
                  ]}
                />
                <DataFlowStep
                  step={3}
                  title="Feature Engineering"
                  description="MLFraudModel extrai 19 features"
                  details={[
                    "Amount features",
                    "Time features",
                    "User history",
                    "IP analysis",
                  ]}
                />
                <DataFlowStep
                  step={4}
                  title="ML Scoring"
                  description="Modelo híbrido calcula score de fraude"
                  details={[
                    "Weighted features",
                    "Sigmoid activation",
                    "Confidence calculation",
                  ]}
                />
                <DataFlowStep
                  step={5}
                  title="Decisão Final"
                  description="DecisionEngine combina scores e decide"
                  details={[
                    "Rule score (40%)",
                    "ML score (60%)",
                    "Recommendation logic",
                  ]}
                />
                <DataFlowStep
                  step={6}
                  title="Persistência"
                  description="Dados salvos no MongoDB para análise"
                  details={[
                    "Transaction document",
                    "Fraud analysis",
                    "User behavior",
                    "System stats",
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML STRATEGY */}
        <TabsContent value="ml-strategy" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <Brain className="mr-2 inline-block h-5 w-5 text-purple-400" />
                  Modelo Híbrido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      Regras Determinísticas
                    </span>
                    <span className="text-blue-400">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Machine Learning</span>
                    <span className="text-purple-400">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
                  <li>Combina precisão de regras com adaptabilidade do ML</li>
                  <li>Pesos ajustáveis por feedback</li>
                  <li>Cold-start com regras, evolução com ML</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <BarChart3 className="mr-2 inline-block h-5 w-5 text-green-400" />
                  Features Engineering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <strong className="text-blue-400">
                      Amount Features (3):
                    </strong>{" "}
                    log, z-score, percentile
                  </div>
                  <div>
                    <strong className="text-green-400">
                      Time Features (4):
                    </strong>{" "}
                    hour, day, weekend, night
                  </div>
                  <div>
                    <strong className="text-purple-400">
                      Geo Features (2):
                    </strong>{" "}
                    country risk, currency mismatch
                  </div>
                  <div>
                    <strong className="text-orange-400">Behavioral (4):</strong>{" "}
                    user stats, deviation patterns
                  </div>
                  <div>
                    <strong className="text-red-400">Velocity (3):</strong>{" "}
                    user, amount, IP velocity
                  </div>
                  <div>
                    <strong className="text-yellow-400">
                      Email Features (3):
                    </strong>{" "}
                    domain risk, length, patterns
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                <TrendingUp className="mr-2 inline-block h-5 w-5 text-blue-400" />
                Sistema de Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
                <li>
                  <strong>Coleta Automática:</strong> Falsos positivos/negativos
                  identificados
                </li>
                <li>
                  <strong>Recalibração:</strong> Pesos ajustados semanalmente
                </li>
                <li>
                  <strong>Retreinamento:</strong> Modelo atualizado com novos
                  dados
                </li>
                <li>
                  <strong>A/B Testing:</strong> Validação de novas versões
                </li>
                <li>
                  <strong>Rollback:</strong> Reversão automática se performance
                  cair
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERFORMANCE */}
        <TabsContent value="performance" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <PerformanceCard
              title="Latência"
              icon={Clock}
              value="127ms"
              target="< 300ms"
              description="Tempo médio de resposta"
              status="excellent"
            />
            <PerformanceCard
              title="Throughput"
              icon={TrendingUp}
              value="1,247"
              target="> 1,000"
              description="Transações por segundo"
              status="excellent"
            />
            <PerformanceCard
              title="Precisão"
              icon={Target}
              value="99.5%"
              target="> 95%"
              description="Taxa de acerto do modelo"
              status="excellent"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <Zap className="mr-2 inline-block h-5 w-5 text-yellow-400" />
                  Otimizações de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
                  <li>Índices compostos no MongoDB (23 índices)</li>
                  <li>Batch processing para logs (100 logs/batch)</li>
                  <li>Memory management (max 100k response times)</li>
                  <li>Connection pooling para database</li>
                  <li>Cleanup automático de dados antigos</li>
                  <li>Feature caching para usuários recorrentes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <BarChart3 className="mr-2 inline-block h-5 w-5 text-blue-400" />
                  Métricas de Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow
                  label="SLA Compliance"
                  value="99.5%"
                  color="text-green-400"
                />
                <MetricRow
                  label="Error Rate"
                  value="0.1%"
                  color="text-green-400"
                />
                <MetricRow
                  label="Memory Usage"
                  value="< 2GB"
                  color="text-blue-400"
                />
                <MetricRow
                  label="CPU Usage"
                  value="< 70%"
                  color="text-blue-400"
                />
                <MetricRow
                  label="Database Connections"
                  value="< 100"
                  color="text-purple-400"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DEPLOYMENT */}
        <TabsContent value="deployment" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <GitBranch className="mr-2 inline-block h-5 w-5 text-purple-400" />
                  Estratégia de Deploy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
                  <li>
                    <strong>Blue-Green Deployment:</strong> Zero downtime
                  </li>
                  <li>
                    <strong>Canary Releases:</strong> 10% → 50% → 100%
                  </li>
                  <li>
                    <strong>Health Checks:</strong> Automáticos pré-deploy
                  </li>
                  <li>
                    <strong>Rollback:</strong> Automático em caso de falha
                  </li>
                  <li>
                    <strong>Feature Flags:</strong> Controle granular
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <Lock className="mr-2 inline-block h-5 w-5 text-red-400" />
                  Segurança & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
                  <li>
                    <strong>API Authentication:</strong> JWT + API Keys
                  </li>
                  <li>
                    <strong>Rate Limiting:</strong> 1000 req/min por cliente
                  </li>
                  <li>
                    <strong>Data Encryption:</strong> TLS 1.3 em trânsito
                  </li>
                  <li>
                    <strong>PII Protection:</strong> Hashing de dados sensíveis
                  </li>
                  <li>
                    <strong>Audit Logs:</strong> Todas as transações logadas
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                <Settings className="mr-2 inline-block h-5 w-5 text-orange-400" />
                Configuração de Ambiente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="text-white font-medium mb-2">Development</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Local MongoDB</li>
                    <li>• Hot reload</li>
                    <li>• Debug logs</li>
                    <li>• Mock data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Staging</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• MongoDB Atlas</li>
                    <li>• Load testing</li>
                    <li>• Performance profiling</li>
                    <li>• Integration tests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Production</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• High availability</li>
                    <li>• Auto-scaling</li>
                    <li>• Monitoring 24/7</li>
                    <li>• Backup automático</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Production Scenarios Section - Always Visible */}
      <div className="mt-12 space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Cenários de Produção
          </h2>
          <p className="text-gray-400">
            Arquiteturas escaláveis para ambientes corporativos com alta
            performance
          </p>
        </div>

        {/* Java/Spring Boot Card */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30 cursor-pointer hover:from-orange-900/30 hover:to-yellow-900/30 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="mr-2 h-6 w-6 text-orange-400" />
                    Cenário Java + Spring Boot
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-900/20 text-orange-400"
                  >
                    Enterprise Ready
                  </Badge>
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  Arquitetura empresarial com Java 21, Spring Boot 3.x e
                  ecossistema robusto para alta escala
                </p>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    <Settings className="mr-2 inline-block h-5 w-5 text-blue-400" />
                    Stack Tecnológico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <TechStackItem
                      category="Runtime"
                      tech="Java 21 (LTS)"
                      description="Virtual Threads, Pattern Matching, Records"
                    />
                    <TechStackItem
                      category="Framework"
                      tech="Spring Boot 3.2+"
                      description="WebFlux, Security, Data JPA, Cloud"
                    />
                    <TechStackItem
                      category="Database"
                      tech="MongoDB + Redis"
                      description="Spring Data MongoDB + Cache"
                    />
                    <TechStackItem
                      category="ML/AI"
                      tech="Weka + DL4J"
                      description="Machine Learning nativo Java"
                    />
                    <TechStackItem
                      category="Messaging"
                      tech="Apache Kafka"
                      description="Event streaming para alta escala"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    <Brain className="mr-2 inline-block h-5 w-5 text-purple-400" />
                    Componentes Mapeados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ComponentMapping
                    from="lib/decision-engine.ts"
                    to="@Service DecisionEngineService"
                    description="Spring Service com @Cacheable"
                  />
                  <ComponentMapping
                    from="lib/fraud-rules.ts"
                    to="@Component FraudRulesEngine"
                    description="Drools Rules Engine integration"
                  />
                  <ComponentMapping
                    from="lib/ml-model.ts"
                    to="@Service MLFraudService"
                    description="Weka/DL4J model wrapper"
                  />
                  <ComponentMapping
                    from="lib/load-tester.ts"
                    to="@Service LoadTestService"
                    description="JMeter integration + Micrometer"
                  />
                  <ComponentMapping
                    from="API Routes"
                    to="@RestController"
                    description="Spring WebFlux reactive endpoints"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <BenefitCard
                title="Performance Enterprise"
                icon={Zap}
                benefits={[
                  "Virtual Threads (Java 21) = 10x+ concorrência",
                  "JVM otimizada para alta carga",
                  "GraalVM Native Image possível",
                  "Reactive Streams com WebFlux",
                ]}
                color="text-yellow-400"
              />
              <BenefitCard
                title="Ecossistema Robusto"
                icon={Shield}
                benefits={[
                  "Spring Security para autenticação",
                  "Micrometer para observabilidade",
                  "Testcontainers para testes",
                  "Spring Cloud para microservices",
                ]}
                color="text-green-400"
              />
              <BenefitCard
                title="Operações & DevOps"
                icon={Settings}
                benefits={[
                  "Spring Actuator para health checks",
                  "Docker + Kubernetes ready",
                  "Distributed tracing com Zipkin",
                  "Prometheus metrics nativo",
                ]}
                color="text-blue-400"
              />
            </div>

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">
                  <TrendingUp className="mr-2 inline-block h-5 w-5 text-orange-400" />
                  Estimativas de Performance Java
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <PerformanceEstimate
                    metric="Latência"
                    current="127ms"
                    java="85ms"
                    improvement="+33%"
                    reason="JVM otimizada + Virtual Threads"
                  />
                  <PerformanceEstimate
                    metric="Throughput"
                    current="1,247 TPS"
                    java="3,500+ TPS"
                    improvement="+180%"
                    reason="Reactive Streams + melhor GC"
                  />
                  <PerformanceEstimate
                    metric="Memory"
                    current="~2GB"
                    java="~1.2GB"
                    improvement="+40%"
                    reason="JVM heap management"
                  />
                  <PerformanceEstimate
                    metric="CPU"
                    current="~70%"
                    java="~45%"
                    improvement="+36%"
                    reason="Compilação JIT otimizada"
                  />
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Rust Card */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 cursor-pointer hover:from-red-900/30 hover:to-orange-900/30 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-6 w-6 text-red-400" />
                    Cenário Rust (Ultra Performance)
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-red-900/20 text-red-400"
                  >
                    Máxima Performance
                  </Badge>
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  Arquitetura de alta performance com Rust, zero-cost
                  abstractions e memory safety
                </p>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    <Code className="mr-2 inline-block h-5 w-5 text-red-400" />
                    Stack Rust
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <TechStackItem
                      category="Runtime"
                      tech="Rust 1.75+"
                      description="Zero-cost abstractions, Memory safety"
                    />
                    <TechStackItem
                      category="Web Framework"
                      tech="Axum + Tokio"
                      description="Async runtime de alta performance"
                    />
                    <TechStackItem
                      category="Database"
                      tech="MongoDB + Redis"
                      description="mongodb crate + redis-rs"
                    />
                    <TechStackItem
                      category="ML/AI"
                      tech="Candle + Ort"
                      description="ML nativo Rust + ONNX Runtime"
                    />
                    <TechStackItem
                      category="Serialization"
                      tech="Serde + MessagePack"
                      description="Serialização ultra-rápida"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    <Brain className="mr-2 inline-block h-5 w-5 text-purple-400" />
                    Componentes Rust
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ComponentMapping
                    from="lib/decision-engine.ts"
                    to="decision_engine.rs"
                    description="Struct + impl com zero allocations"
                  />
                  <ComponentMapping
                    from="lib/fraud-rules.ts"
                    to="fraud_rules.rs"
                    description="Pattern matching + enum variants"
                  />
                  <ComponentMapping
                    from="lib/ml-model.rs"
                    to="ml_model.rs"
                    description="SIMD operations + Candle tensors"
                  />
                  <ComponentMapping
                    from="lib/load-tester.ts"
                    to="load_tester.rs"
                    description="Tokio tasks + channels"
                  />
                  <ComponentMapping
                    from="API Routes"
                    to="Axum handlers"
                    description="Zero-copy request handling"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <BenefitCard
                title="Performance Extrema"
                icon={Zap}
                benefits={[
                  "Zero-cost abstractions",
                  "SIMD instructions automáticas",
                  "Memory layout otimizado",
                  "Compilação ahead-of-time",
                ]}
                color="text-red-400"
              />
              <BenefitCard
                title="Memory Safety"
                icon={Shield}
                benefits={[
                  "Sem garbage collector",
                  "Ownership system previne leaks",
                  "Thread safety garantida",
                  "Buffer overflow impossível",
                ]}
                color="text-green-400"
              />
              <BenefitCard
                title="Concorrência"
                icon={Activity}
                benefits={[
                  "Tokio async runtime",
                  "Green threads eficientes",
                  "Lock-free data structures",
                  "Work-stealing scheduler",
                ]}
                color="text-blue-400"
              />
            </div>

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">
                  <Target className="mr-2 inline-block h-5 w-5 text-red-400" />
                  Estimativas de Performance Rust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <PerformanceEstimate
                    metric="Latência"
                    current="127ms"
                    java="35ms"
                    improvement="+72%"
                    reason="Zero-cost abstractions + SIMD"
                  />
                  <PerformanceEstimate
                    metric="Throughput"
                    current="1,247 TPS"
                    java="8,500+ TPS"
                    improvement="+580%"
                    reason="Tokio async + zero allocations"
                  />
                  <PerformanceEstimate
                    metric="Memory"
                    current="~2GB"
                    java="~400MB"
                    improvement="+80%"
                    reason="Sem GC + ownership system"
                  />
                  <PerformanceEstimate
                    metric="CPU"
                    current="~70%"
                    java="~25%"
                    improvement="+64%"
                    reason="Compilação nativa otimizada"
                  />
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </DashboardShell>
  );
}

// Helper Components
interface SystemOverviewCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  metrics: Array<{ label: string; value: string }>;
}

function SystemOverviewCard({
  title,
  icon: Icon,
  description,
  metrics,
}: SystemOverviewCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Icon className="mr-2 h-5 w-5 text-blue-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex justify-between text-sm">
              <span className="text-gray-300">{metric.label}</span>
              <span className="text-blue-400 font-mono">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ComponentCardProps {
  title: string;
  file: string;
  description: string;
  features: string[];
}

function ComponentCard({
  title,
  file,
  description,
  features,
}: ComponentCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <Badge variant="outline" className="w-fit text-xs">
          <Code className="mr-1 h-3 w-3" />
          {file}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface DataFlowStepProps {
  step: number;
  title: string;
  description: string;
  details: string[];
}

function DataFlowStep({
  step,
  title,
  description,
  details,
}: DataFlowStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {step}
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface PerformanceCardProps {
  title: string;
  icon: React.ElementType;
  value: string;
  target: string;
  description: string;
  status: "excellent" | "good" | "warning";
}

function PerformanceCard({
  title,
  icon: Icon,
  value,
  target,
  description,
  status,
}: PerformanceCardProps) {
  const statusColors = {
    excellent: "text-green-400",
    good: "text-blue-400",
    warning: "text-yellow-400",
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle
          className={`text-white flex items-center ${statusColors[status]}`}
        >
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`mb-1 text-3xl font-bold ${statusColors[status]}`}>
          {value}
        </div>
        <div className="text-sm text-gray-400 mb-1">Target: {target}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  color: string;
}

function MetricRow({ label, value, color }: MetricRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-300">{label}</span>
      <span className={`font-mono ${color}`}>{value}</span>
    </div>
  );
}

// Additional Helper Components
interface TechStackItemProps {
  category: string;
  tech: string;
  description: string;
}

function TechStackItem({ category, tech, description }: TechStackItemProps) {
  return (
    <div className="border-l-2 border-blue-500/30 pl-3">
      <div className="text-sm text-gray-400">{category}</div>
      <div className="text-white font-medium">{tech}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}

interface ComponentMappingProps {
  from: string;
  to: string;
  description: string;
}

function ComponentMapping({ from, to, description }: ComponentMappingProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="text-gray-400 font-mono text-xs">{from}</div>
      <div className="text-blue-400">→</div>
      <div className="text-white font-medium">{to}</div>
      <div className="text-xs text-gray-500">({description})</div>
    </div>
  );
}

interface BenefitCardProps {
  title: string;
  icon: React.ElementType;
  benefits: string[];
  color: string;
}

function BenefitCard({ title, icon: Icon, benefits, color }: BenefitCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className={`text-white flex items-center ${color}`}>
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1 pl-5 text-xs text-gray-300">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface PerformanceEstimateProps {
  metric: string;
  current: string;
  java: string;
  improvement: string;
  reason: string;
}

function PerformanceEstimate({
  metric,
  current,
  java,
  improvement,
  reason,
}: PerformanceEstimateProps) {
  return (
    <div className="text-center">
      <div className="text-white font-medium text-sm">{metric}</div>
      <div className="text-gray-400 text-xs mb-1">Atual: {current}</div>
      <div className="text-blue-400 font-bold">{java}</div>
      <div className="text-green-400 text-xs font-medium">{improvement}</div>
      <div className="text-gray-500 text-xs mt-1">{reason}</div>
    </div>
  );
}
