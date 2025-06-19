"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { logger, LogLevel, type LogEntry } from "@/lib/logger"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Download, Filter, Search } from "lucide-react"

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = logger.subscribe((newLogs) => {
      setLogs(newLogs)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    let filtered = [...logs]

    // Filter by level
    if (levelFilter !== "all") {
      const level = Number.parseInt(levelFilter)
      filtered = filtered.filter((log) => log.level >= level)
    }

    // Filter by source
    if (sourceFilter !== "all") {
      filtered = filtered.filter((log) => log.source === sourceFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.source.toLowerCase().includes(term) ||
          (log.data && JSON.stringify(log.data).toLowerCase().includes(term)),
      )
    }

    setFilteredLogs(filtered)
  }, [logs, levelFilter, sourceFilter, searchTerm])

  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [filteredLogs, autoScroll])

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return "bg-gray-100 text-gray-800"
      case LogLevel.INFO:
        return "bg-blue-100 text-blue-800"
      case LogLevel.WARN:
        return "bg-yellow-100 text-yellow-800"
      case LogLevel.ERROR:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelName = (level: LogLevel) => {
    return LogLevel[level]
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    })
  }

  const clearLogs = () => {
    logger.clear()
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `heimdall-logs-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const sources = [...new Set(logs.map((log) => log.source))]
  const stats = logger.getStats()

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
            <div className="text-sm text-gray-600">Total Logs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
            <div className="text-sm text-gray-600">Errors (5min)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnCount}</div>
            <div className="text-sm text-gray-600">Warnings (5min)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <div className="text-sm text-gray-600">Filtered</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Log Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Level:</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0">Debug+</SelectItem>
                  <SelectItem value="1">Info+</SelectItem>
                  <SelectItem value="2">Warn+</SelectItem>
                  <SelectItem value="3">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Source:</label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setAutoScroll(!autoScroll)}>
                Auto-scroll: {autoScroll ? "ON" : "OFF"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Real-time system logs - {filteredLogs.length} entries shown</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full" ref={scrollAreaRef}>
            <div className="space-y-1">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No logs match the current filters</div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 font-mono text-sm"
                  >
                    <div className="text-xs text-gray-500 min-w-[80px]">{formatTimestamp(log.timestamp)}</div>
                    <Badge className={`${getLevelColor(log.level)} min-w-[60px] text-center`}>
                      {getLevelName(log.level)}
                    </Badge>
                    <Badge variant="outline" className="min-w-[100px] text-center">
                      {log.source}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-gray-900">{log.message}</div>
                      {log.data && (
                        <div className="text-xs text-gray-600 mt-1 bg-gray-100 p-1 rounded">
                          {typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : String(log.data)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
