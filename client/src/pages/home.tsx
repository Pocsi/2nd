import HeroSection from "@/components/hero-section";
import ProductProtocolSteps from "@/components/product-protocol-steps";
import ProductListing from "@/components/product-listing";
import P2PVerificationSection from "@/components/p2p-verification";
import SellerFlow from "@/components/seller-flow";
import TransactionProcess from "@/components/transaction-process";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductProtocolSteps />
      <ProductListing />
      <P2PVerificationSection />
      <SellerFlow />
      <TransactionProcess />
    </>
  );
}
