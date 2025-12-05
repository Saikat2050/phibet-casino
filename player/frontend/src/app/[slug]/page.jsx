import { getCmsData } from "@/actions";
import PdfRender from "@/components/PdfRender";
import { notFound } from 'next/navigation';

export default async function Page({ params }) {

  const { slug } = params;

  // Check if the URL ends with `.pdf`
   // Check if the URL ends with `.pdf`
   if (slug.endsWith(".pdf")) {
    // Map the slug to the correct path inside the 'public/pdf' folder
   return <PdfRender slug={slug}/>
  }

  const response = await getCmsData(params.slug);


  if (!response?.data?.success) {
    notFound();
  }

  const details = response?.data?.data;

  return (
    <div className="text-white">
       <div
       className="text-white"
      //  style={{ color: "rgba(255, 255, 255, 0.4)" }}
       dangerouslySetInnerHTML={{ __html: details?.content?.EN }}
     />
    </div>
  );
}