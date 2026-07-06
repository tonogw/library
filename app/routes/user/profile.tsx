"use client";
import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import type { UserProfileData } from "~/types";
import api from "~/lib/api/axios";
import { toast } from "sonner";
import UserProfileTab from "~/components/shared/userProfileTab";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "~/store";

export default function Profile() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // State form to transit edited data
  const [formDataState, setFormDataState] = useState({
    phone: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["currentUserProfileData"],
    queryFn: async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await api.get("/api/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return res.data;
    },
    enabled: mounted,
    staleTime: 10000,
  });

  const user: UserProfileData = userResponse?.data?.profile;

  // Sync api data
  useEffect(() => {
    if (user) {
      setFormDataState({
        phone: user.phone,
      });
    }
  }, [user]);

  const saveProfileData = async (payloadPhone: string, file?: File) => {
    if (!payloadPhone.trim()) {
      alert("Phone cannot be empty");
      return;
    }
    if (payloadPhone && (payloadPhone.length < 8 || payloadPhone.length > 20)) {
      alert("Phone number be empty");
      return;
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("File size too large. maximum size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    formData.append("profilePhoto", file);

    try {
      toast.loading("Uploading profile photo ...");
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await api.patch("/api/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (res.data?.success || res.status === 200) {
        toast.dismiss();
        alert("Profile photo updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["currentUserProfileData"] });
      }
    } catch (error: any) {
      toast.dismiss();
      const serverMessage =
        error?.response?.data?.message || "Failed to upload photo.";
      alert(`Upload failed: ${serverMessage}`);
    }
    await saveProfileData(formDataState.phone, file);
  };

  const handleUpdateProfileSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      await saveProfileData(formDataState.phone);
    }
  };

  if (!mounted || isLoading) {
    // return toast("Loading profile data...");
    return (
      <div className="flex min-h-screen w-full flex-col justify-between bg-[#FDFDFD] font-['Quicksand']">
        <div className="w-full">
          <Navbar />
          <UserProfileTab />
          <div className="py-20 text-center font-['Quicksand'] font-bold text-gray-400">
            Loading profile data...
          </div>
        </div>
        <div className="clear-both block w-full content-none">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-between bg-[#FDFDFD] font-['Quicksand']">
      <div className="w-full">
        <Navbar />
        <UserProfileTab />

        {/* Outer Container Level */}
        <div className="mx-4 mt-14 mb-20 flex w-full max-w-139.25 flex-col items-start gap-6 px-4 md:px-0 lg:ml-55">
          {/* MAIN PROFILE CARD BLOCK  */}
          <div className="align-self-stretch order-1 flex w-full flex-none grow-0 flex-col items-start gap-6">
            {/* Title Section */}
            <h1 className="w-full text-[28px] leading-9.5 font-bold tracking-[-0.03em] text-[#0A0D12]">
              Profile
            </h1>

            {/* Data Display Card  */}
            <div
              className="align-self-stretch order-1 flex w-full flex-none grow-0 flex-col items-start gap-6 border border-gray-50 bg-[#FFFFFF] p-5"
              style={{
                height: "298px",
                boxShadow: "0px 0px 20px rgba(203, 202, 202, 0.25)",
                borderRadius: "16px",
              }}
            >
              {/* Info Rows Area */}
              <div className="align-self-stretch order-0 flex h-47.5 w-full flex-none grow-0 flex-col items-start gap-3">
                <div
                  className="group relative cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div
                    className="order-0 flex-none grow-0 rounded-full border border-gray-200 bg-gray-100 bg-cover bg-center transition-opacity group-hover:opacity-80"
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundImage: `url(${user?.profilePhoto || "/images/book-placeholder.png"})`,
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Edit
                  </div>
                </div>

                <input
                  id="profile-photo"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />

                {/* Row 1: Name  */}
                <div className="align-self-stretch order-1 flex h-7.5 w-full flex-none grow-0 flex-row items-center justify-between gap-33.75 p-0">
                  <span className="text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-[#0A0D12]">
                    Name
                  </span>
                  <span className="max-w-62.5 truncate text-right text-[16px] leading-7.5 font-bold tracking-[-0.02em] text-[#0A0D12]">
                    {user.name}
                  </span>
                </div>

                {/* Row 2: Email  */}
                <div className="align-self-stretch order-2 flex h-7.5 w-full flex-none grow-0 flex-row items-center justify-between gap-33.75 p-0">
                  <span className="text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-[#0A0D12]">
                    Email
                  </span>
                  <span className="max-w-62.5 truncate text-right text-[16px] leading-7.5 font-bold tracking-[-0.02em] text-[#0A0D12]">
                    {user.email}
                  </span>
                </div>

                {/* Row 3: Nomor Handphone  */}
                <div className="align-self-stretch order-3 flex h-7.5 w-full flex-none grow-0 flex-row items-center justify-between gap-33.75 p-0">
                  <span className="text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-[#0A0D12]">
                    Nomor Handphone
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="0812345678"
                      value={formDataState.phone}
                      onChange={(e) =>
                        setFormDataState({
                          ...formDataState,
                          phone: e.target.value,
                        })
                      }
                      className="w-2/3 rounded-lg border border-gray-300 px-3 py-1 text-right text-[16px] font-bold text-[#0A0D12] focus:border-[#1C65DA] focus:outline-none"
                    />
                  ) : (
                    <span className="max-w-62.5 truncate py-4 text-right text-[16px] leading-7.5 font-bold tracking-[-0.02em] text-[#0A0D12]">
                      {user.phone || ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: Update Profile */}
              <button
                type="button"
                onClick={handleUpdateProfileSubmit}
                // onClick={() => {
                //   localStorage.removeItem("token");
                //   window.location.href = "/login";
                // }}
                className="align-self-stretch order-1 flex w-full flex-none grow-0 cursor-pointer flex-row items-center justify-center gap-2 bg-[#1C65DA] p-2 shadow-sm transition-colors hover:bg-[#154eb3]"
                style={{ height: "44px", borderRadius: "100px" }}
              >
                <span className="text-[16px] leading-7.5 font-bold tracking-[-0.02em] text-[#FDFDFD]">
                  {/* Update Profile */}
                  {isEditing ? "Save Changes" : "Update Profile"}
                </span>
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormDataState({ phone: user?.phone || "" });
                  }}
                  className="w-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="clear-both block w-full content-none">
        <Footer />
      </div>
    </div>
  );
}
