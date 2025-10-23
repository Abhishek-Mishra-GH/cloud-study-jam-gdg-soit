"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface StudentData {
  "User Name": string
  "User Email": string
  "Google Cloud Skills Boost Profile URL": string
  "Profile URL Status": string
  "Access Code Redemption Status": string
  "All Skill Badges & Games Completed": string
  "# of Skill Badges Completed": number
  "Names of Completed Skill Badges": string
  "# of Arcade Games Completed": number
  "Names of Completed Arcade Games": string
}

export default function Home() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.json")
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student["User Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        student["User Email"].toLowerCase().includes(searchQuery.toLowerCase())

      const isCompleted = student["All Skill Badges & Games Completed"] === "Yes"
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "completed" && isCompleted) ||
        (filterStatus === "pending" && !isCompleted)

      return matchesSearch && matchesFilter
    })
  }, [students, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = students.length
    const completed = students.filter((s) => s["All Skill Badges & Games Completed"] === "Yes").length
    const pending = total - completed

    return { total, completed, pending }
  }, [students])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-accent to-destructive flex items-center justify-center">
                <span className="text-white font-bold text-lg">☁️</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">GCS Study Jam 2025</h1>
                <p className="text-sm text-muted-foreground font-medium">GDG SOIT Progress Tracker</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Total Students, Completed, and In Progress */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Students" value={stats.total} color="blue" />
          <StatCard label="Completed" value={stats.completed} color="green" />
          <StatCard label="In Progress" value={stats.pending} color="yellow" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white dark:bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="h-10"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
              className="h-10"
            >
              Completed
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className="h-10"
            >
              Pending
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Badges</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Games</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-secondary/50 dark:hover:bg-card/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">{student["User Name"]}</span>
                          <span className="text-xs text-muted-foreground">{student["User Email"]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {student["# of Skill Badges Completed"]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                            {student["# of Arcade Games Completed"]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge completed={student["All Skill Badges & Games Completed"] === "Yes"} />
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={student["Google Cloud Skills Boost Profile URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <span className="text-xs font-medium">View</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: "blue" | "green" | "yellow" | "red"
}) {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    yellow:
      "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    red: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  }

  return (
    <Card className={`border ${colorMap[color]} p-4`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </Card>
  )
}

function StatusBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        completed
          ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
          : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
      }`}
    >
      {completed ? "✓ Completed" : "⏳ In Progress"}
    </span>
  )
}
