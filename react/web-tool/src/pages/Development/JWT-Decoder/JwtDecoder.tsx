import { JwtContent } from "@/pages/Development/JWT-Decoder/components/JwtContent";

export default function JwtDecoder() {
  return (
    <main className="container mx-auto py-8 text-light-text dark:text-dark-text">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">JWT Decoder</h1>
        <p className="text-muted-foreground mb-8">
          Paste your JWT token to decode its header and payload
        </p>
        <JwtContent />
      </div>
    </main>
  );
} 