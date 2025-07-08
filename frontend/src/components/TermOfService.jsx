import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>

      <div className="space-y-8 text-justify text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2">OVERVIEW</h2>
          <p>
            This website is operated by RHR Creative. Throughout the site, the
            terms “we”, “us” and “our” refer to RHR Creative. RHR Creative offers
            this website, including all information, tools and services available
            from this site to you, the user, conditioned upon your acceptance of
            all terms, conditions, policies and notices stated here.
          </p>
          <p>
            By visiting our site and/or purchasing something from us, you engage
            in our “Service” and agree to be bound by the following terms and
            conditions (“Terms of Service”, “Terms”), including those additional
            terms and conditions and policies referenced herein and/or available
            by hyperlink. These Terms of Service apply to all users of the site,
            including without limitation users who are browsers, vendors,
            customers, merchants, and/or contributors of content.
          </p>
          <p>
            Please read these Terms of Service carefully before accessing or using
            our website. By accessing or using any part of the site, you agree to
            be bound by these Terms of Service. If you do not agree to all the
            terms and conditions of this agreement, then you may not access the
            website or use any services.
          </p>
          <p>
            Any new features or tools which are added to the current website shall
            also be subject to the Terms of Service. We reserve the right to
            update, change or replace any part of these Terms of Service by
            posting updates and/or changes to our website. It is your
            responsibility to check this page periodically for changes. Your
            continued use of or access to the website following the posting of any
            changes constitutes acceptance of those changes.
          </p>
        </section>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <Section key={num} number={num} />
        ))}

      </div>
    </div>
  );
};

// Reusable component for each section
const Section = ({ number }) => {
  const sections = {
    1: {
      title: "ONLINE STORE TERMS",
      content: `
By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority and you have given us your consent to allow any of your minor dependents to use this site.
You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
You must not transmit any worms or viruses or any code of a destructive nature.
A breach or violation of any of the Terms will result in an immediate termination of your Services.`
    },
    2: {
      title: "GENERAL CONDITIONS",
      content: `
We reserve the right to refuse service to anyone for any reason at any time.
You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks; and changes to conform and adapt to technical requirements of connecting networks or devices.
Credit card information is always encrypted during transfer over networks.
You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission.
The headings used in this agreement are included for convenience only.`
    },
    3: {
      title: "ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
      content: `
We are not responsible if information made available on this site is not accurate, complete or current.
Any reliance on the material on this site is at your own risk.
We reserve the right to modify the contents at any time, but we have no obligation to update any information.
You agree that it is your responsibility to monitor changes.`
    },
    4: {
      title: "MODIFICATIONS TO THE SERVICE AND PRICES",
      content: `
Prices for our products are subject to change without notice.
We reserve the right at any time to modify or discontinue the Service without notice.
We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance.`
    },
    5: {
      title: "PRODUCTS OR SERVICES",
      content: `
Certain products or services may be available exclusively online through the website.
These may have limited quantities and are subject to return/exchange according to our Return Policy.
We reserve the right to limit sales by person, region, or jurisdiction and to discontinue any product at any time.
We do not warrant that the quality of any products will meet your expectations.`
    },
    6: {
      title: "ACCURACY OF BILLING AND ACCOUNT INFORMATION",
      content: `
We reserve the right to refuse any order.
We may limit or cancel quantities per person, household or order.
You agree to provide current, complete and accurate purchase/account information.
Please review our Returns Policy for more detail.`
    },
    7: {
      title: "OPTIONAL TOOLS",
      content: `
We may provide you with access to third-party tools without control or input.
Use of these tools is entirely at your own risk and discretion.
We may also introduce new services/features subject to these Terms of Service.`
    },
    8: {
      title: "THIRD-PARTY LINKS",
      content: `
Some content or services may include materials from third-parties.
We are not responsible for the content or accuracy and have no liability for third-party websites.
Please review third-party policies before any transactions.`
    },
    9: {
      title: "USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
      content: `
By submitting content, you grant us unrestricted rights to use, edit, copy, publish and distribute.
You agree that your comments will not violate any third-party rights and will not contain harmful or unlawful material.
You are solely responsible for your comments.`
    },
    10: {
      title: "PERSONAL INFORMATION",
      content: `
Your submission of personal information through the store is governed by our Privacy Policy.`
    },
    11: {
      title: "ERRORS, INACCURACIES AND OMISSIONS",
      content: `
Occasionally there may be errors or inaccuracies related to product descriptions, pricing, availability etc.
We reserve the right to correct and update information without prior notice.`
    },
    12: {
      title: "PROHIBITED USES",
      content: `
You are prohibited from using the site for unlawful purposes, violating rights, uploading malicious code, spamming, and any other activity that interferes with the website.
We may terminate your access if found violating.`
    },
    13: {
      title: "DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
      content: `
We do not guarantee that use of our service will be uninterrupted or error-free.
All services/products are provided “as is” and “as available.”
We shall not be liable for any direct or indirect damages.`
    },
    14: {
      title: "INDEMNIFICATION",
      content: `
You agree to indemnify and hold harmless RHR Creative, its affiliates and partners from any claim or demand due to your breach of these Terms or violation of any law.`
    },
    15: {
      title: "SEVERABILITY",
      content: `
If any provision is determined unlawful, void, or unenforceable, the remaining provisions shall remain valid and enforceable.`
    },
    16: {
      title: "TERMINATION",
      content: `
These Terms are effective until terminated by either you or us.
We may terminate your access if we suspect non-compliance.`
    },
    17: {
      title: "ENTIRE AGREEMENT",
      content: `
These Terms constitute the entire agreement between you and us and govern your use of the Service, superseding any prior agreements.`
    },
    18: {
      title: "GOVERNING LAW",
      content: `
These Terms of Service shall be governed by and construed in accordance with the laws of Pakistan.`
    },
    19: {
      title: "CHANGES TO TERMS OF SERVICE",
      content: `
We reserve the right to update or change any part of these Terms by posting updates to our website.
It is your responsibility to check periodically for changes.`
    },
    20: {
      title: "CONTACT INFORMATION",
      content: `
Questions about the Terms of Service should be sent to us at support@rhrcreative.com.`
    }
  };

  const { title, content } = sections[number];

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">SECTION {number} - {title}</h2>
      {content.split("\n").map((line, idx) => (
        <p key={idx} className="mb-2 text-sm">{line.trim()}</p>
      ))}
    </section>
  );
};

export default TermsOfService;
