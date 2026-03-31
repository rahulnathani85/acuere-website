# Acuere Consultancy — Windows Server Deployment Guide

## Overview
This guide deploys the Acuere website on your Windows Server using IIS (Internet Information Services).

---

## Step 1: Enable IIS on Windows Server

1. Open **Server Manager**
2. Click **Manage** > **Add Roles and Features**
3. Click **Next** until you reach **Server Roles**
4. Check **Web Server (IIS)**
5. Click **Add Features** when prompted
6. Click **Next** through the remaining screens and then **Install**
7. Wait for installation to complete

**Verify:** Open a browser on the server and go to `http://localhost` — you should see the IIS default page.

---

## Step 2: Copy Website Files to the Server

1. On the server, navigate to: `C:\inetpub\wwwroot\`
2. Delete the default IIS files (iisstart.htm, iisstart.png)
3. Copy your entire `acuere-website` folder contents into `C:\inetpub\wwwroot\`

Your folder should look like:
```
C:\inetpub\wwwroot\
├── index.html
├── about.html
├── valuations.html
├── cfo-services.html
├── audit-forensics.html
├── investment-banking.html
├── services.html
├── contact.html
├── style.css
├── script.js
├── vercel.json        (can delete, not needed for IIS)
├── .gitignore         (can delete)
└── images\
    ├── logo.jpg
    ├── rahul-nathani.jpg
    └── sakshi-nathani.jpg
```

---

## Step 3: Configure IIS

### 3a. Set up Default Document
1. Open **IIS Manager** (search for it in Start menu)
2. Click on your server name in the left panel
3. Click on **Default Web Site**
4. Double-click **Default Document**
5. Make sure `index.html` is in the list (add it if not)

### 3b. Enable Clean URLs (optional)
Create a file called `web.config` in `C:\inetpub\wwwroot\` with this content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <remove fileExtension=".woff" />
            <remove fileExtension=".woff2" />
            <mimeMap fileExtension=".woff" mimeType="font/woff" />
            <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
        </staticContent>
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-Frame-Options" value="SAMEORIGIN" />
            </customHeaders>
        </httpProtocol>
        <caching>
            <profiles>
                <add extension=".css" policy="CacheForTimePeriod" kernelCachePolicy="CacheForTimePeriod" duration="7.00:00:00" />
                <add extension=".js" policy="CacheForTimePeriod" kernelCachePolicy="CacheForTimePeriod" duration="7.00:00:00" />
                <add extension=".jpg" policy="CacheForTimePeriod" kernelCachePolicy="CacheForTimePeriod" duration="30.00:00:00" />
                <add extension=".png" policy="CacheForTimePeriod" kernelCachePolicy="CacheForTimePeriod" duration="30.00:00:00" />
            </profiles>
        </caching>
    </system.webServer>
</configuration>
```

---

## Step 4: Point Your Domain to the Server

1. Find your server's **public IP address**
   - On the server, open Command Prompt and run: `ipconfig`
   - Or check your cloud provider's dashboard for the public IP

2. Log into your **domain registrar** (GoDaddy, Namecheap, etc.)

3. Go to **DNS Settings** for `acuereconsultancy.com`

4. Add/update these DNS records:
   - **A Record:** Host = `@`, Points to = `YOUR_SERVER_IP`, TTL = 600
   - **A Record:** Host = `www`, Points to = `YOUR_SERVER_IP`, TTL = 600

5. Wait for DNS propagation (10 minutes to 48 hours)

### 4b. Add Domain Binding in IIS
1. Open **IIS Manager**
2. Click **Default Web Site**
3. Click **Bindings...** on the right panel
4. Click **Add...**
5. Type = `http`, Host name = `acuereconsultancy.com`, Port = `80`
6. Click **OK**
7. Add another: Host name = `www.acuereconsultancy.com`, Port = `80`

---

## Step 5: Set Up SSL (HTTPS) with Let's Encrypt

1. Download **Win-ACME** from: https://www.win-acme.com/
2. Extract to `C:\win-acme\`
3. Run `wacs.exe` as Administrator
4. Follow the prompts:
   - Choose **N** (Create certificate with default settings)
   - Select your IIS site
   - Enter your email for notifications
5. Win-ACME will automatically:
   - Get a free SSL certificate from Let's Encrypt
   - Configure IIS to use HTTPS
   - Set up auto-renewal

### 5b. Force HTTPS Redirect
Add this to your `web.config` inside `<system.webServer>`:

```xml
<rewrite>
    <rules>
        <rule name="HTTP to HTTPS" stopProcessing="true">
            <match url="(.*)" />
            <conditions>
                <add input="{HTTPS}" pattern="off" />
            </conditions>
            <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
        </rule>
    </rules>
</rewrite>
```

Note: You need the **URL Rewrite** module for IIS. Download from:
https://www.iis.net/downloads/microsoft/url-rewrite

---

## Step 6: Set Up Contact Form (Web3Forms)

1. Go to https://web3forms.com and sign up with `rahul@acuereconsultancy.com`
2. Copy your **Access Key** from the dashboard
3. Open `script.js` on the server
4. Replace `YOUR_ACCESS_KEY_HERE` with your actual key
5. Save the file

That's it! Form submissions will be emailed to you automatically.

---

## Step 7: Open Firewall Ports

Make sure your server's firewall allows:
- **Port 80** (HTTP)
- **Port 443** (HTTPS)

### Windows Firewall:
1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** > **New Rule...**
3. Select **Port** > TCP > Specific ports: `80, 443`
4. Allow the connection
5. Apply to all profiles
6. Name: "Web Server HTTP/HTTPS"

### Cloud Provider Firewall:
Also check your cloud provider's security group/firewall settings to ensure ports 80 and 443 are open to the public.

---

## Done!

Your website should now be live at:
- http://acuereconsultancy.com (redirects to HTTPS)
- https://acuereconsultancy.com
- https://www.acuereconsultancy.com

---

## Updating the Website Later

To update the website:
1. Edit files on your local computer
2. Push to GitHub: `git add . && git commit -m "Update" && git push`
3. On the server, pull changes: `cd C:\inetpub\wwwroot && git pull`

Or simply copy the updated files to `C:\inetpub\wwwroot\` on the server.
