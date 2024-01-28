import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type Props = {};

const FAQs = (props: Props) => {
  return (
    <div className="container py-24">
      <div className="dark:text-white font-bold mb-8">
        <h4>Frequently Asked Questions</h4>
      </div>
      <div className="w-full md:w-3/6 mx-auto">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent className="text-left dark:text-neutral-400">
              Simply click on the Start Trading button on the home page and you
              will be directed to the web app where you can make your
              transactions through live chat.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>How can I trust you?</AccordionTrigger>
            <AccordionContent className="text-left dark:text-neutral-400">
              This is a very common question from all new customers and the fact
              is that you can trust us. We have been running our business
              legitimately over the years and The Great Exchange Technologies
              Limited is registered with the Corporate Affairs Commission (CAC)
              with a Registration number: 1945065.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What&apos;s your payment duration?
            </AccordionTrigger>
            <AccordionContent className="text-left dark:text-neutral-400">
              Normally all payments are made immediately after confirmation of
              (valid) giftcards or cryptocurrencies
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Why do you trade through a chat?
            </AccordionTrigger>
            <AccordionContent className="text-left dark:text-neutral-400">
              Based on experience, we have noticed that people prefer a
              face-to-face virtual communication for trading their gift cards.
              Hence we provide the best customer service via chat.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What are the Giftcards rates?</AccordionTrigger>
            <AccordionContent className="text-left dark:text-neutral-400">
              Due to fluctuations in rates to get the current rate of a
              particular giftcard or asset click here and our customer service
              agents will attend to you
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
