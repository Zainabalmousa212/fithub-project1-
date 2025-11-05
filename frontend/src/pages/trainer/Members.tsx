// src/pages/trainer/Members.tsx
import { useEffect, useMemo, useState } from "react";
import TrainerLayout from "@/components/TrainerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Mail, Phone, Calendar, TrendingUp, Loader2, Eye, BarChart3, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { get, post, del } from "@/lib/api";
import { toast } from "sonner";

type Member = {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  joined: string;        // مثال: "Jan 2025"
  attendance: number;    // 0-100
  lastActive: string;    // مثال: "Today"
  status: "Active" | "Inactive";
};

export default function TrainerMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // add-dialog state
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // view details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [removing, setRemoving] = useState(false);

  // جلب الأعضاء من الباك
  async function fetchMembers() {
    try {
      setLoading(true);
      setErrorMsg(null);
      //  *****هنا تم تغيير من  members  الى api / members
      const data = await get<Member[]>("/api/members"); // GET /api/members
      setMembers(data);
    } catch (err: any) {
      setErrorMsg(typeof err?.message === "string" ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  // إضافة عضو جديد
  async function handleAdd() {
    setSaving(true);
    try {
      // *** تم تغيير من  /api/members الى /members
      const created = await post<Member>("/api/members", {
        name: newName,
        email: newEmail,
        phone: newPhone,
      }); // POST /api/members
      setMembers((prev) => [created, ...prev]);
      setOpen(false);
      setNewName(""); setNewEmail(""); setNewPhone("");
      toast.success("Member added successfully!");
    } catch (err: any) {
      toast.error(typeof err?.message === "string" ? err.message : "Failed to add member");
    } finally {
      setSaving(false);
    }
  }

  // فتح تفاصيل العضو
  function handleViewDetails(member: Member) {
    setSelectedMember(member);
    setDetailsOpen(true);
  }

  // عرض معلومات العضو
  function handleViewInfo() {
    if (!selectedMember) return;
    toast.info(`Viewing info for ${selectedMember.name}`);
    // يمكنك هنا فتح صفحة أو dialog آخر لعرض التفاصيل الكاملة
  }

  // عرض تقدم العضو
  function handleViewProgress() {
    if (!selectedMember) return;
    toast.info(`Viewing progress for ${selectedMember.name}`);
    // يمكنك هنا فتح صفحة أو dialog آخر لعرض التقدم
  }

  // حذف العضو
  async function handleRemoveMember() {
    if (!selectedMember) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedMember.name}? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setRemoving(true);
    try {
      await del(`/api/members/${selectedMember.id}`); // DELETE /api/members/:id
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      setDetailsOpen(false);
      setSelectedMember(null);
      toast.success("Member removed successfully!");
    } catch (err: any) {
      toast.error(typeof err?.message === "string" ? err.message : "Failed to remove member");
    } finally {
      setRemoving(false);
    }
  }

  const totalActive = members.filter((m) => m.status === "Active").length;
  const avgAttendance =
    members.length > 0
      ? Math.round(members.reduce((s, m) => s + (m.attendance ?? 0), 0) / members.length)
      : 0;

  return (
    <TrainerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">Manage and monitor your gym members</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <Input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <Input type="tel" placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                <Button className="w-full" onClick={handleAdd} disabled={saving || !newName || !newEmail}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Add Member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Errors */}
        {errorMsg && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{members.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalActive}</p>
                <p className="text-sm text-muted-foreground mt-1">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{avgAttendance}%</p>
                <p className="text-sm text-muted-foreground mt-1">Avg Attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {members.filter((m) => m.joined?.toLowerCase().includes("jan 2025")).length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">New This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Members List */}
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading members...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((member) => (
              <Card key={member.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {member.joined}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-medium">Attendance: {member.attendance}%</span>
                      </div>
                      <span className="text-muted-foreground">Last: {member.lastActive}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(member)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Member Actions</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedMember.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewInfo}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Member Info
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewProgress}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>

                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleRemoveMember}
                    disabled={removing}
                  >
                    {removing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Member
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TrainerLayout>
  );
}
