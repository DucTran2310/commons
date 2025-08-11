import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/ThemeContext";
import { CopyButton } from "@/pages/Development/JWT-Decoder/components/BtnCopy";
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lightfair } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CustomJwtPayload extends JwtPayload {
  [key: string]: any;
}

export function JwtContent() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<CustomJwtPayload | null>(null);
  const [payload, setPayload] = useState<CustomJwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publicKeyUrl, setPublicKeyUrl] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    error?: string;
  } | null>(null);
  const [securityIssues, setSecurityIssues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme();

  const isLikelyJWT = (token: string) => {
    return token.split('.').length === 3 && 
           /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]*?$/.test(token);
  };

  const checkSecurityIssues = (header: CustomJwtPayload, payload: CustomJwtPayload) => {
    const issues = [];
    
    if (header.alg === 'none') {
      issues.push("Security issue: Algorithm set to 'none' - unsigned tokens are insecure");
    }
    
    if (payload.exp && payload.exp < Date.now() / 1000) {
      issues.push("Token has expired");
    }
    
    const sensitiveClaims = ['password', 'secret', 'private_key'];
    sensitiveClaims.forEach(claim => {
      if (payload[claim]) {
        issues.push(`Security warning: Token contains sensitive claim '${claim}'`);
      }
    });
    
    return issues;
  };

  const verifyToken = async () => {
    if (!token || !publicKeyUrl) return;
    
    setIsLoading(true);
    try {
      const JWKS = createRemoteJWKSet(new URL(publicKeyUrl));
      await jwtVerify(token, JWKS);
      setVerificationResult({ isValid: true });
    } catch (err) {
      setVerificationResult({ 
        isValid: false, 
        error: err instanceof Error ? err.message : "Verification failed" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decodeToken = () => {
    try {
      if (!token) {
        setError("Please enter a JWT token");
        return;
      }

      let actualToken = token;
      if (token.includes('%')) {
        try {
          actualToken = decodeURIComponent(token);
        } catch (e) {
          console.log("Token is not URL-encoded");
        }
      }

      const parts = actualToken.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format - should have 3 parts separated by dots");
      }

      const decodedHeader = jwtDecode(actualToken, { header: true });
      const decodedPayload = jwtDecode(actualToken);

      const alg = decodedHeader?.alg?.toUpperCase();
      const supportedAlgs = ["HS256", "RS256", "ES256", "PS256", "NONE"];
      
      if (!alg || !supportedAlgs.includes(alg)) {
        setError(`Unsupported algorithm: ${alg || 'none'}`);
        return;
      }

      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError(null);
      setSecurityIssues(checkSecurityIssues(decodedHeader, decodedPayload));
      
      if (publicKeyUrl) {
        verifyToken();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid JWT token";
      setError(`Decoding failed: ${errorMsg}`);
      setHeader(null);
      setPayload(null);
      setVerificationResult(null);
      setSecurityIssues([]);
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value.trim();
    setToken(newToken);
    
    if (newToken) {
      if (isLikelyJWT(newToken)) {
        decodeToken();
      } else {
        setError("This doesn't appear to be a valid JWT format");
        setHeader(null);
        setPayload(null);
        setVerificationResult(null);
        setSecurityIssues([]);
      }
    } else {
      setHeader(null);
      setPayload(null);
      setError(null);
      setVerificationResult(null);
      setSecurityIssues([]);
    }
  };

  const handlePublicKeyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setPublicKeyUrl(url);
    
    if (url && token) {
      verifyToken();
    } else {
      setVerificationResult(null);
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <Label htmlFor="jwt-token">Encoded JWT</Label>
        <Textarea
          id="jwt-token"
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter JWT token here..."
          className="min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="public-key-url">Public Key/JWKS URL (optional)</Label>
        <Input
          id="public-key-url"
          value={publicKeyUrl}
          onChange={handlePublicKeyUrlChange}
          placeholder="https://your-domain.com/.well-known/jwks.json"
          disabled={isLoading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}

      {verificationResult && (
        <Alert variant={verificationResult.isValid ? "default" : "destructive"}>
          {verificationResult.isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>
            {verificationResult.isValid 
              ? "Token signature is valid" 
              : `Signature verification failed: ${verificationResult.error}`}
          </AlertDescription>
        </Alert>
      )}

      {securityIssues.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              SECURITY WARNINGS
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {securityIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(header || payload) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-sm font-mono">HEADER: ALGORITHM & TOKEN TYPE</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <SyntaxHighlighter 
                  language="json" 
                  style={theme === 'light' ? lightfair : atomDark}
                  customStyle={{ 
                    margin: 0, 
                    padding: '1rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                >
                  {formatJson(header)}
                </SyntaxHighlighter>
                <CopyButton value={formatJson(header)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-sm font-mono">PAYLOAD: DATA</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <SyntaxHighlighter 
                  language="json" 
                  style={theme === 'light' ? lightfair : atomDark}
                  customStyle={{ 
                    margin: 0, 
                    padding: '1rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                >
                  {formatJson(payload)}
                </SyntaxHighlighter>
                <CopyButton value={formatJson(payload)} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {payload && (
        <TokenInfo payload={payload} />
      )}
    </div>
  );
}

function TokenInfo({ payload }: { payload: CustomJwtPayload | null }) {
  if (!payload) return null;

  const expiry = payload.exp ? new Date(payload.exp * 1000) : null;
  const issuedAt = payload.iat ? new Date(payload.iat * 1000) : null;
  const now = new Date();

  return (
    <Card>
      <CardHeader className="py-3 px-4 bg-gray-100 dark:bg-gray-800 ">
        <CardTitle className="text-sm font-mono">TOKEN INFORMATION</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        {expiry && (
          <div className="flex justify-between">
            <span>Expires:</span>
            <span className={expiry < now ? "text-red-500" : "text-green-500"}>
              {expiry.toLocaleString()} {expiry < now && "(Expired)"}
            </span>
          </div>
        )}
        {issuedAt && (
          <div className="flex justify-between">
            <span>Issued At:</span>
            <span>{issuedAt.toLocaleString()}</span>
          </div>
        )}
        {payload.iss && (
          <div className="flex justify-between">
            <span>Issuer:</span>
            <span>{payload.iss}</span>
          </div>
        )}
        {payload.aud && (
          <div className="flex justify-between">
            <span>Audience:</span>
            <span>{typeof payload.aud === 'string' ? payload.aud : payload.aud?.join(', ')}</span>
          </div>
        )}
        {payload.sub && (
          <div className="flex justify-between">
            <span>Subject:</span>
            <span>{payload.sub}</span>
          </div>
        )}
        {payload.jti && (
          <div className="flex justify-between">
            <span>JWT ID:</span>
            <span>{payload.jti}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}