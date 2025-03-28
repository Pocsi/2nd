import React, { useState } from "react";

interface Step {
  id: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  description: string;
  icon: React.ReactNode;
  detailedSteps?: string[];
}

export default function ProductProtocolSteps() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  
  const handleExpandStep = (stepId: number) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
  };
  
  const [steps, setSteps] = useState<Step[]>([
    { 
      id: 1, 
      label: "Upload", 
      isActive: true, 
      isCompleted: false,
      description: "List your items with detailed condition documentation and set your crypto preferences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      detailedSteps: [
        "Take high-quality photos of your item from multiple angles",
        "Provide honest details about any defects or wear",
        "Set your price in USD (will be converted to crypto automatically)",
        "Select which cryptocurrencies you're willing to accept",
        "Choose delivery options (office drop-off or pickup service)"
      ]
    },
    { 
      id: 2, 
      label: "Buying Selection", 
      isActive: false, 
      isCompleted: false,
      description: "Pay with your preferred cryptocurrency while locking in the fiat value to protect against market volatility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      detailedSteps: [
        "Browse available items and add to cart",
        "Select your preferred cryptocurrency for payment",
        "Fiat value is locked at checkout regardless of crypto fluctuations",
        "Enter your wallet address for receiving the item",
        "Escrow system holds funds until verification is complete"
      ]
    },
    { 
      id: 3, 
      label: "P2P Verification", 
      isActive: false, 
      isCompleted: false,
      description: "Video confirmation ensures the actual condition of items matches the listing before finalizing transactions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      detailedSteps: [
        "Schedule a live video call with the seller",
        "Verify the item's condition matches the listing description",
        "Ask the seller to demonstrate any functional aspects",
        "Confirm all listed defects are accurately represented",
        "Approve, negotiate price adjustment, or cancel based on verification"
      ]
    },
    { 
      id: 4, 
      label: "Shipping Verification", 
      isActive: false, 
      isCompleted: false,
      description: "Independent shipping agent verifies the item before secure delivery to buyer.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      detailedSteps: [
        "Shipping agent receives the item from seller",
        "Agent performs independent verification of condition",
        "Item is professionally packaged for secure transit",
        "Tracking information is provided to both buyer and seller",
        "Secure chain of custody is maintained throughout shipping"
      ]
    },
    { 
      id: 5, 
      label: "Receiving", 
      isActive: false, 
      isCompleted: false,
      description: "Buyer confirms receipt and satisfaction, releasing the payment to the seller.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      detailedSteps: [
        "Buyer receives the item and confirms delivery",
        "Final verification of condition against listing",
        "Payment is released to seller from escrow",
        "Buyer can leave feedback and rating for the seller",
        "Transaction is complete and recorded on the blockchain"
      ]
    },
  ]);

  return (
    <section className="py-12 bg-secondary" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our 5-Step Product Protocol</h2>
        
        <div className="step-indicator flex items-center justify-between max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`step ${step.isActive ? 'active' : ''} ${step.isCompleted ? 'completed' : ''} flex flex-col items-center flex-1`}>
                <div 
                  className={`step-number w-10 h-10 rounded-full ${step.isActive ? 'bg-accent text-primary' : step.isCompleted ? 'bg-success text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-semibold mb-2 cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => handleExpandStep(step.id)}
                >
                  {step.id}
                </div>
                <div className="step-label text-sm text-center">{step.label}</div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`step-line ${step.isCompleted ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {expandedStep && (
          <div className="max-w-3xl mx-auto mb-12 bg-white p-6 rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mr-4 flex-shrink-0">
                {steps.find(s => s.id === expandedStep)?.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{steps.find(s => s.id === expandedStep)?.label}</h3>
                <p className="text-gray-600 mb-4">{steps.find(s => s.id === expandedStep)?.description}</p>
                
                <div className="space-y-2">
                  {steps.find(s => s.id === expandedStep)?.detailedSteps?.map((step, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              className="ml-auto block text-sm font-medium text-primary"
              onClick={() => setExpandedStep(null)}
            >
              Close details
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.slice(0, 3).map(step => (
            <div 
              key={step.id}
              className="bg-white p-6 rounded-lg shadow-custom hover:shadow-custom-hover transition-shadow cursor-pointer"
              onClick={() => handleExpandStep(step.id)}
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.label}</h3>
              <p className="text-gray-600">{step.description}</p>
              <button className="mt-4 text-sm font-medium text-primary inline-flex items-center">
                <span>See details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            className="inline-flex items-center text-primary font-medium hover:underline"
            onClick={() => expandedStep ? setExpandedStep(null) : setExpandedStep(4)}
          >
            <span>See all steps</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          .step-line {
            height: 2px;
            background-color: #e5e7eb;
            flex-grow: 1;
            margin: 0 5px;
          }
          .step-line.active {
            background-color: #10b981;
          }
        `
      }} />
    </section>
  );
}
