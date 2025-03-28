import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function P2PVerificationDialog() {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const handleVideoCall = async () => {
    try {
      // Request access to the user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      setIsConnected(true);
      
      // In a real implementation, here we would set up WebRTC peer connection
      // and handle signaling for connecting with the other party
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const endCall = () => {
    if (localStream) {
      // Stop all tracks in the stream
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsConnected(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          Start P2P Verification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Peer-to-Peer Video Verification</DialogTitle>
          <DialogDescription>
            Verify your transaction through a secure video call with the other party.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="videocall">Video Call</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions" className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">How P2P Verification Works</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Both buyer and seller need to be online at the scheduled time</li>
                <li>The seller should have the item ready for inspection</li>
                <li>The buyer will verify the item's condition matches the listing</li>
                <li>Use the checklist below to verify all aspects of the product</li>
                <li>After verification, both parties confirm the transaction</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Verification Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-md p-3">
                  <h4 className="font-medium mb-2">Seller Responsibilities</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Show product from multiple angles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Demonstrate any functionality as requested</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Point out any defects listed in the description</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Show packaging if available</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-border rounded-md p-3">
                  <h4 className="font-medium mb-2">Buyer Responsibilities</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Verify product matches listing description</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Request specific views or demonstrations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Confirm condition is as described</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ask any final questions before approving</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={() => {
                  const element = document.querySelector('[data-value="videocall"]') as HTMLElement;
                  if (element) element.click();
                }} 
                className="w-full"
              >
                Proceed to Video Call
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="videocall" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-md p-2 aspect-video bg-black relative">
                {isConnected ? (
                  <video
                    ref={(videoRef) => {
                      if (videoRef && localStream) {
                        videoRef.srcObject = localStream;
                      }
                    }}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">Your camera</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">You</div>
              </div>
              
              <div className="border border-border rounded-md p-2 aspect-video bg-black relative">
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <p className="text-gray-400">Waiting for the other party...</p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Other Party</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 pt-4">
              {!isConnected ? (
                <Button onClick={handleVideoCall} className="bg-primary hover:bg-primary/90">
                  Start Call
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828-3.172-3.172a1 1 0 010-1.414l2.828-2.828m13.8 10.231l-2.172-2.172" />
                    </svg>
                    Toggle Mute
                  </Button>
                  <Button variant="outline" className="bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Share Screen
                  </Button>
                  <Button onClick={endCall} variant="destructive">
                    End Call
                  </Button>
                </>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Verification Status</h3>
              <div className="bg-secondary/30 p-3 rounded-md">
                <p className="text-sm">
                  {isConnected 
                    ? "Call in progress. Complete your verification and both parties must confirm after inspection."
                    : "Waiting to start the video call. Both parties must be present for verification."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function P2PVerificationSection() {
  return (
    <section className="py-12 bg-white" id="p2p-verification">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">P2P Video Verification</h2>
          <p className="text-gray-600 mb-6">Our unique peer-to-peer verification process ensures the authenticity and condition of items before payment is released.</p>
          <P2PVerificationDialog />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-secondary/30 p-6 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Verification</h3>
            <p className="text-gray-600">Verify condition through live video without in-person meetings, saving time while maintaining trust.</p>
          </div>
          
          <div className="bg-secondary/30 p-6 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
            <p className="text-gray-600">Visual confirmation prevents fraud and ensures both parties are confident in the transaction.</p>
          </div>
          
          <div className="bg-secondary/30 p-6 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Escrow Release</h3>
            <p className="text-gray-600">Payment is held securely in escrow and only released once verification is successfully completed by both parties.</p>
          </div>
        </div>
      </div>
    </section>
  );
}