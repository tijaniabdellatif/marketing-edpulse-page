import { cn } from "@/lib/utils";

import { testimonials } from "@/data/constants";
import TestimonialColumn from "@/components/ui/testimonial-column";


const firstColumn = testimonials.slice(0, 4);
const secondColumn = testimonials.slice(4, 8);
const thirdColumn = testimonials.slice(8, 12);

export default function Testimonials() {
  return (
    <div className="overflow-x-clip  bg-slate-100 overflow-hidden  py-10 md:py-12 pb-20 font-mulish-sans">
        <div className="max-w-[540px] mx-auto pricing-head_before relative">
          <div className="flex justify-center py-4">
           
          </div>
          <h2 className={cn([
            'text-center',
            'text-gradient-blue-teal',
            'text-3xl lg:text-6xl md:text-4xl py-2 font-semibold tracking-tighter'
          ])}>What our learners say</h2>
          <p className={cn([
            'text-center mt-4 text-base leading-7 tracking-tight',
            "md:text-[18px] md:text-center md:leading-8 lg:text-1xl lg:leading-10 text-color-dark font-poppins"
          ])}>
            Join thousands of learners who have
            powered their english level

          </p>




        </div>

        <div className={cn([
          'flex justify-center gap-6 mt-10 overflow-hidden',
          '[mask-image:linear-gradient(to_bottom,transparent,black_15%,#D4AF37_85%,transparent)]',
          'h-[600px]',
          "" // Increased height
        ])}>
          <TestimonialColumn testimonials={firstColumn} duration={15} />
          <TestimonialColumn testimonials={secondColumn} duration={19} className="hidden md:block" />
          <TestimonialColumn testimonials={thirdColumn} duration={17} className="hidden lg:block" />
        </div>
     
    </div>
  );
}