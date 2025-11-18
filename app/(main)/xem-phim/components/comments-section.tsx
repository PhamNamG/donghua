"use client";

import { useState } from "react";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZaloButton } from "../../../../components/zalo-button";

interface Comment {
  user: string;
  content: string;
  rating: number;
  date: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  zaloLink: string;
}

export function CommentsSection({ comments, zaloLink }: CommentsSectionProps) {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setComment("");
  };

  return (
    <Tabs defaultValue="comments" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="comments">Bình luận</TabsTrigger>
      </TabsList>
      <TabsContent value="comments">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bình luận</h2>
            <ZaloButton href={zaloLink} variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4" />
              Chat trên Zalo
            </ZaloButton>
          </div>

          <form
            onSubmit={handleSubmitComment}
            className="p-4 rounded-lg border mb-6"
          >
            <h3 className="font-medium mb-2">Thêm bình luận</h3>
            <textarea
              className="w-full p-2 border rounded-md mb-2 min-h-[100px]"
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={handleCommentChange}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                💡 Tham gia nhóm Zalo để thảo luận realtime!
              </p>
              <Button type="submit">Đăng bình luận</Button>
            </div>
          </form>

          <div className="space-y-6">
            {comments && comments.length > 0 ? (
              comments.map((comment: Comment, i: number) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{comment.user}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{comment.rating}/10</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {comment.content}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {comment.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/20">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
                <ZaloButton href={zaloLink} variant="default" size="sm">
                  Thảo luận trên Zalo
                </ZaloButton>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
