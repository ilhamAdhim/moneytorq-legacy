"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coffee } from "lucide-react";

export function DonationForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "https://ko-fi.com";
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-amber-500" />
            <CardTitle>Support Our Work</CardTitle>
          </div>
          <CardDescription>Help us continue improving MoneytorQ for everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Leave us a message (optional)"
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
              Support on Ko-fi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
