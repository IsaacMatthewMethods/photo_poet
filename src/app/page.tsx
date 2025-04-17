"use client";

import { useState, useRef } from 'react';
import { generatePoemFromImage } from '@/ai/flows/generate-poem-from-image';
import { refinePoemTone } from '@/ai/flows/refine-poem-tone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, RefreshCw } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<string>("romantic");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePoemGeneration = async () => {
    if (!image) {
      toast({
        title: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generatePoemFromImage({ imageUrl: image });
      setPoem(result.poem);
    } catch (error: any) {
      toast({
        title: "Error generating poem.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePoemRefinement = async () => {
    if (!poem) {
       toast({
        title: "Generate a poem first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await refinePoemTone({ poem: poem, tone: tone });
      setPoem(result.refinedPoem);
    } catch (error: any) {
      toast({
        title: "Error refining poem.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen antialiased text-foreground">
        <Sidebar className="w-60 border-r bg-card text-card-foreground">
           <SidebarHeader>
            <ModeToggle />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Options</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuButton onClick={triggerFileInput}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span>Upload Image</span>
                </SidebarMenuButton>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <SidebarMenuButton onClick={handlePoemGeneration} disabled={loading}>
                  <span>Generate Poem</span>
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
             <SidebarGroup>
              <SidebarGroupLabel>Refine</SidebarGroupLabel>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                  <SelectItem value="whimsical">Whimsical</SelectItem>
                  <SelectItem value="melancholy">Melancholy</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-[180px]" onClick={handlePoemRefinement} disabled={loading}>
                Refine Poem
              </Button>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-center text-sm text-muted-foreground">
              Powered by Firebase Studio
            </p>
          </SidebarFooter>
        </Sidebar>
        <div className="container mx-auto flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl fade-in" style={{ animation: 'fadeIn 0.75s ease-in-out' }}>
            <CardContent className="flex flex-col items-center space-y-4">
              {image && (
                <img
                  src={image}
                  alt="Uploaded"
                  className="mb-4 max-h-96 rounded-md object-cover"
                  style={{ animation: 'fade-in 0.5s ease-in-out' }}
                />
              )}
              {poem ? (
                
                  <Textarea
                    value={poem}
                    readOnly
                    className="w-full text-center text-lg"
                    style={{ animation: 'fade-in 1s ease-in-out' }}
                  />
                
              ) : (
                !loading && <p className="text-center text-muted-foreground">No poem generated yet.</p>
              )}
              {loading && <RefreshCw className="animate-spin" />}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
