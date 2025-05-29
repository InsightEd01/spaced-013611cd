
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  subject: string;
  body: string;
  recipients: string;
  template_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, body, recipients, template_id }: EmailRequest = await req.json();

    // In a real implementation, you would:
    // 1. Fetch recipient email addresses based on the recipients parameter
    // 2. Apply template variables if template_id is provided
    // 3. Send emails to the actual recipients

    // For demo purposes, we'll send to a test email
    const emailResponse = await resend.emails.send({
      from: "School System <onboarding@resend.dev>",
      to: ["test@example.com"], // In production, this would be the actual recipients
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">School Notification</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <footer style="margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated message from the School Management System.</p>
          </footer>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
