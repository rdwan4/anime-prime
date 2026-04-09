export default function DMCAPage() {
  return (
    <div className="container mx-auto px-6 md:px-12 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">DMCA Notice</h1>
      <div className="space-y-6 text-gray-400 leading-relaxed">
        <p>ANIMEPRIME is in compliance with 17 U.S.C. § 512 and the Digital Millennium Copyright Act ("DMCA"). It is our policy to respond to any infringement notices and take appropriate actions under the Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws.</p>
        
        <p>If your copyrighted material has been posted on ANIMEPRIME or if links to your copyrighted material are returned through our search engine and you want this material removed, you must provide a written communication that details the information listed in the following section.</p>

        <h2 className="text-2xl font-bold text-white mt-8">Copyright Infringement Notification</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Evidence that you are the owner of the industrial property right.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email.</li>
        </ul>
        
        <p className="mt-8 italic text-sm">Please allow 2-5 business days for an email response. Note that emailing your complaint to other parties such as our Internet Service Provider will not expedite your request.</p>
      </div>
    </div>
  );
}
