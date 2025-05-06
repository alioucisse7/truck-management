
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// In real use, obtain this from user session/permissions
const DEMO_COMPANY_ID = 1;

const InviteUserForm = () => {
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    // @ts-ignore
    const { supabase } = window;
    if (!supabase) {
      toast({ title: "Error", description: "Supabase client not found.", variant: "destructive" });
      setInviting(false);
      return;
    }

    try {
      // 1. Invite user via Supabase Auth (send invite email)
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setInviting(false);
        return;
      }

      // 2. Add relationship to company_users table
      // new user uid returned in data.user.id
      if (data.user?.id) {
        const { error: insertError } = await supabase
          .from("company_users")
          .insert([{ user_id: data.user.id, company_id: DEMO_COMPANY_ID, role: "member" }]);

        if (insertError) {
          toast({ title: "Error", description: insertError.message, variant: "destructive" });
          setInviting(false);
          return;
        }
      }

      toast({ title: "Success", description: `Invitation sent to ${email}` });
      setEmail("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setInviting(false);
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <label htmlFor="user_email" className="block font-medium mb-1">User Email</label>
        <Input
          id="user_email"
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={inviting || !email}>
        {inviting ? "Inviting..." : "Send Invitation"}
      </Button>
    </form>
  );
};

export default InviteUserForm;
