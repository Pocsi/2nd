import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Transaction, Product } from "@shared/schema";

export default function TransactionVerification() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(3); // P2P Verification is Step 3
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "approved" | "negotiated" | "cancelled">("pending");
  const [checksCompleted, setChecksCompleted] = useState({
    matchesDescription: false,
    defectsAccurate: false,
    itemFunctional: false
  });

  const { data: transaction, isLoading: isLoadingTransaction } = useQuery<Transaction>({
    queryKey: [`/api/transactions/${id}`],
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${transaction?.productId}`],
    enabled: !!transaction,
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async (data: { step: number; status: string }) => {
      return apiRequest("PATCH", `/api/transactions/${id}/step`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/transactions/${id}`] });
      toast({
        title: "Verification completed",
        description: verificationStatus === "approved" 
          ? "The product has been verified. Proceeding to the next step." 
          : verificationStatus === "negotiated"
          ? "Negotiation request has been sent to the seller."
          : "The transaction has been cancelled and your payment will be refunded.",
      });

      if (verificationStatus === "approved") {
        // Move to next step (shipping verification)
        setTimeout(() => {
          setLocation(`/`); // In a real app this would go to the next step
        }, 2000);
      } else {
        // Return to home for cancelled or negotiated
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction status",
        variant: "destructive",
      });
    }
  });

  const handleCheckChange = (check: keyof typeof checksCompleted) => {
    setChecksCompleted({
      ...checksCompleted,
      [check]: !checksCompleted[check]
    });
  };

  const handleVerificationComplete = () => {
    updateTransactionMutation.mutate({
      step: 4, // Moving to step 4
      status: verificationStatus
    });
  };

  const allChecksCompleted = Object.values(checksCompleted).every(val => val);

  if (isLoadingTransaction || isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-custom p-8 text-center">
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-600">Loading verification details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction || !product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-custom p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Transaction Not Found</h2>
            <p className="mb-6">Sorry, we couldn't find the transaction you're looking for.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-primary text-white hover:bg-opacity-90"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="flex items-center text-primary hover:text-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-custom overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">P2P Video Verification</h1>
              <span className="text-sm bg-accent text-primary px-3 py-1 rounded-full">Step {currentStep} of 5</span>
            </div>
            <p className="text-gray-600 mt-2">Verify the condition of "{product.title}" before proceeding with the transaction</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                  {/* This would be a real video component in a production app */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs">
                    Seller
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    variant={isMuted ? "secondary" : "outline"}
                    size="sm"
                    className="flex items-center"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                    Mute
                  </Button>
                  
                  <Button
                    variant={isVideoOn ? "outline" : "secondary"}
                    size="sm"
                    className="flex items-center"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Leave
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Verification Checklist:</h3>
                  <div className="space-y-2">
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={checksCompleted.matchesDescription}
                        onChange={() => handleCheckChange('matchesDescription')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">The item matches the listing description</span>
                    </label>
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={checksCompleted.defectsAccurate}
                        onChange={() => handleCheckChange('defectsAccurate')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">All mentioned defects are visible and accurately described</span>
                    </label>
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={checksCompleted.itemFunctional}
                        onChange={() => handleCheckChange('itemFunctional')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">The seller has demonstrated that the item is functional</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-secondary rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span>{product.condition}</span>
                    </div>
                    {product.defects && (
                      <div>
                        <span className="text-gray-600">Defects:</span>
                        <p className="mt-1">{product.defects}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Packaging:</span>
                      <span>{product.originalPackaging ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-primary text-white px-2 py-0.5 rounded text-xs">
                    You
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Chat with the seller and ask them to demonstrate any features or details you want to verify.
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-semibold mb-4">Post-Verification Options:</h3>
              <div className="space-y-3">
                <div 
                  className={`border ${verificationStatus === 'approved' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationStatus('approved')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationStatus === 'approved'}
                      onChange={() => setVerificationStatus('approved')}
                      className="text-accent focus:ring-accent" 
                    />
                    <div className="ml-3">
                      <div className="font-medium">Approve & Continue</div>
                      <div className="text-sm text-gray-500">The item is as described and I'm ready to proceed</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border ${verificationStatus === 'negotiated' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationStatus('negotiated')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationStatus === 'negotiated'}
                      onChange={() => setVerificationStatus('negotiated')}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Negotiate</div>
                      <div className="text-sm text-gray-500">Request a price adjustment based on the actual condition</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border ${verificationStatus === 'cancelled' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationStatus('cancelled')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationStatus === 'cancelled'}
                      onChange={() => setVerificationStatus('cancelled')}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Cancel Transaction</div>
                      <div className="text-sm text-gray-500">The item is significantly different from what was described</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8 space-x-4">
              <Button variant="outline" onClick={() => setLocation("/")}>
                Cancel
              </Button>
              <Button 
                variant="default"
                className="bg-primary text-white hover:bg-opacity-90"
                disabled={!allChecksCompleted || updateTransactionMutation.isPending || verificationStatus === "pending"}
                onClick={handleVerificationComplete}
              >
                {updateTransactionMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Verification'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
