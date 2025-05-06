
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { authService, ProfileUpdateData, PasswordChangeData } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  
  const profileApi = useApi();
  const passwordApi = useApi();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-lg text-muted-foreground">Profile not found.</span>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const handleProfileUpdate = async (data: ProfileUpdateData) => {
    try {
      await profileApi.execute(authService.updateProfile(data));
    } catch (error) {
      throw error;
    }
  };

  const handlePasswordChange = async (data: PasswordChangeData) => {
    try {
      await passwordApi.execute(authService.changePassword(data));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-purple-100 p-4 mb-2">
            <User className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>{user.name || "No Name"}</CardTitle>
          {user.role && (
            <Badge className="mt-2 capitalize">{user.role}</Badge>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Profile Info</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-6 space-y-4">
              <div>
                <span className="block text-muted-foreground text-xs uppercase">Email</span>
                <span className="font-medium">{user.email || "-"}</span>
              </div>
              <div>
                <span className="block text-muted-foreground text-xs uppercase">Role</span>
                <span className="font-medium capitalize">{user.role || "-"}</span>
              </div>
              <div>
                <span className="block text-muted-foreground text-xs uppercase">Company</span>
                <span className="font-medium">
                  {user.companyName || "No company"}
                </span>
              </div>
              {user.phone && (
                <div>
                  <span className="block text-muted-foreground text-xs uppercase">Phone</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="edit" className="mt-6">
              <div className="space-y-4 p-2">
                <h3 className="text-lg font-medium">Edit Profile Information</h3>
                <ProfileForm 
                  initialData={{
                    name: user.name,
                    email: user.email,
                    phone: user.phone || ""
                  }}
                  onSubmit={handleProfileUpdate}
                  isLoading={profileApi.loading}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="password" className="mt-6">
              <div className="space-y-4 p-2">
                <h3 className="text-lg font-medium">Change Password</h3>
                <ChangePasswordForm
                  onSubmit={handlePasswordChange}
                  isLoading={passwordApi.loading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
