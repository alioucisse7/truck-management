
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// In real use, obtain this from user session/permissions
const DEMO_COMPANY_ID = 1;

const CreateMemberForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    // @ts-ignore
    const { supabase } = window;
    if (!supabase) {
      toast({ title: "Error", description: "Supabase client not found.", variant: "destructive" });
      setCreating(false);
      return;
    }

    try {
      // 1. Create user with email & password & optional full name
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: fullName },
        email_confirm: true   // (prevents confirmation email, marks email as confirmed)
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setCreating(false);
        return;
      }

      // 2. Add relationship to company_users table
      if (data.user?.id) {
        const { error: insertError } = await supabase
          .from("company_users")
          .insert([{ user_id: data.user.id, company_id: DEMO_COMPANY_ID, role: "member" }]);

        if (insertError) {
          toast({ title: "Error", description: insertError.message, variant: "destructive" });
          setCreating(false);
          return;
        }
      }

      toast({ title: "Success", description: `User ${email} created and added to company!` });
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setCreating(false);
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block font-medium mb-1">Full Name</label>
        <Input
          id="full_name"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="member_email" className="block font-medium mb-1">User Email</label>
        <Input
          id="member_email"
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="member_password" className="block font-medium mb-1">Password</label>
        <Input
          id="member_password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={creating || !email || !password || !fullName}>
        {creating ? "Creating..." : "Create Member"}
      </Button>
    </form>
  );
};

export default CreateMemberForm;
