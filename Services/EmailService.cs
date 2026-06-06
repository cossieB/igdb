using System;
using System.Text.Json;
using igdb.Models;
using Microsoft.AspNetCore.Identity;
using Resend;

namespace igdb.Services;

public class EmailService(IResend resend) : IEmailSender<User>
{
    private readonly IResend resendClient = resend;

    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        try
        {
            var response = await resendClient.EmailSendAsync(new EmailMessage()
            {
                From = "no-reply@cossie.dev",
                To = email,
                Subject = "Confirm your email",
                HtmlBody = $"<p>Click the link to confirm your email <a href=\"{confirmationLink}\">{confirmationLink}</a>!</p>",
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
    }

    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        try
        {
            var response = await resendClient.EmailSendAsync(new EmailMessage()
            {
                From = "no-reply@cossie.dev",
                To = email,
                Subject = $"Your password reset code is {resetCode}",
                HtmlBody = $"Your password reset code is {resetCode}",
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
    }

    public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        try
        {
            var response = await resendClient.EmailSendAsync(new EmailMessage()
            {
                From = "no-reply@cossie.dev",
                To = email,
                Subject = "Confirm your email",
                HtmlBody = $"<p>Click the link to reset your password <a href=\"{resetLink}\">{resetLink}</a>!</p>",
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
    }
}
