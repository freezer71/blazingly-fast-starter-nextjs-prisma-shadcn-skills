"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, User, Clock, CheckCircle2, Trash2, Ban } from "lucide-react"
import { toast } from "sonner"

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, setActiveTab] = useState("users")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      // Fetch users using better-auth admin plugin
      const { data } = await authClient.admin.listUsers({
        query: {
          limit: 100,
        }
      })
      
      if (data) {
        setUsers(data.users)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSetRole(userId: string, role: string) {
    const { error } = await authClient.admin.setRole({
      userId,
      role: role.toLowerCase() as "admin" | "user"
    })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Role updated to ${role}`)
      loadData()
    }
  }

  async function handleBanUser(_userId: string) {
     toast.info("Ban feature implementation pending better-auth plugin config")
     // authClient.admin.banUser({ userId: _userId })
  }

  async function handleDeleteUser(userId: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      const { error } = await authClient.admin.removeUser({ userId })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("User removed")
        loadData()
      }
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your application users and data.</p>
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="flex gap-2">
              <User className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <Clock className="h-4 w-4" /> System Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>A list of all registered users in your system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">Loading users...</TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">No users found.</TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.firstName} {user.lastName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.emailVerified ? (
                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                                Unverified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleSetRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Make {user.role === "ADMIN" ? "User" : "Admin"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBanUser(user.id)} className="text-yellow-600">
                                  <Ban className="mr-2 h-4 w-4" /> Ban User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter(u => u.emailVerified).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admins</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter(u => u.role === "ADMIN").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
