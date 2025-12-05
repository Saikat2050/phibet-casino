"use client";

import useModalsStore from "@/store/useModalsStore";
import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ResetPasswordModal from "@/components/Auth/PasswordResetModal";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <Dialog open={true} onClose={() => {}} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0   bg-opacity-75 transition-opacity"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex justify-center p-4 items-center min-h-dvh">
          <DialogPanel className="w-full flex items-center justify-center">
            <ResetPasswordModal token={token} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default ForgotPasswordPage;
