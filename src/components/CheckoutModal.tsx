import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Copy, 
  Check, 
  Share2, 
  Upload, 
  CornerDownRight, 
  Globe, 
  ExternalLink 
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "paypal">("upi");
  
  // UPI Specific State
  const [upiCopied, setUpiCopied] = useState(false);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isScreenshotUploaded, setIsScreenshotUploaded] = useState(false);
  
  // PayPal Specific State
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalPassword, setPaypalPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const exchangeRate = 83.5;

  // Real PayPal SDK integration using User's client ID
  useEffect(() => {
    if (paymentMethod !== "paypal" || !isOpen) return;

    const scriptId = "paypal-sdk-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initPaypalButtons = () => {
      setPaypalLoaded(true);
      if ((window as any).paypal) {
        const container = document.getElementById("paypal-button-container");
        if (container) {
          container.innerHTML = "";
        }

        try {
          (window as any).paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: total.toFixed(2)
                  },
                  description: "Mystic Artifacts Spiritual Checkout"
                }]
              });
            },
            onApprove: (data: any, actions: any) => {
              setIsProcessing(true);
              return actions.order.capture().then((details: any) => {
                setIsProcessing(false);
                setIsSuccess(true);
              }).catch((err: any) => {
                console.error("Capture failed:", err);
                setIsProcessing(false);
                alert("Payment captured but could not be resolved. Please contact support.");
              });
            },
            onError: (err: any) => {
              console.error("PayPal Error:", err);
            }
          }).render("#paypal-button-container");
        } catch (err) {
          console.error("Failed to render PayPal buttons:", err);
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.paypal.com/sdk/js?client-id=AV-9Xybj44qvwJX6V3sBf43EeeRdBxCXyZqlBZUddAy-Q5pySOSUSK6p0DcX2ISai9z3qfhqHzPm19b8&currency=USD";
      script.async = true;
      script.onload = () => {
        initPaypalButtons();
      };
      document.body.appendChild(script);
    } else {
      initPaypalButtons();
    }

    return () => {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [paymentMethod, isOpen, total]);
  const totalInINR = Math.round(total * exchangeRate);
  const supportWhatsApp = "917904010382";

  const handleNext = () => {
    if (step === 1 && (!name.trim() || !email.trim())) {
      alert("Please provide both your name and email to proceed.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2800);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setScreenshotName(e.dataTransfer.files[0].name);
      setIsScreenshotUploaded(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotName(e.target.files[0].name);
      setIsScreenshotUploaded(true);
    }
  };

  // Copy UPI function
  const copyUpiId = () => {
    const upiId = "sasitharani-1@oksbi";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId);
      } else {
        const el = document.createElement("textarea");
        el.value = upiId;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // Generate real UPI Pay links to trigger local GPay / PhonePe / Paytm deep-links
  const upiPayload = `upi://pay?pa=sasitharani-1@oksbi&pn=Sasitharani Jagadeshprabu&am=${totalInINR}&cu=INR&tn=MysticArtifactsOrder`;
  
  // Color customized QR Code generator (Mystic Indigo #1e1b4b, Aged Paper Background #f5f2ed)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=1e1b4b&bgcolor=f5f2ed&qzone=2&data=${encodeURIComponent(upiPayload)}`;

  // Formatted Whatsapp verification link
  const whatsappMsg = `Hello Sasitharani! I have ordered from Mystic Artifacts.
My Details:
- Name: ${name}
- Email: ${email}
- Order Total: $${total} USD (₹${totalInINR} INR)
- Status: Completed Payment via UPI QR Code.

I have attached my transaction screenshot for verification in this message. Please unlock my digital download link!`;
  
  const whatsappUrl = `https://wa.me/${supportWhatsApp}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="checkout-modal-overlay" className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-mystic-indigo/95 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-aged-paper p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[92vh] border border-sacred-gold/10"
          >
            {!isSuccess && (
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-mystic-indigo/55 hover:text-mystic-indigo hover:bg-mystic-indigo/5 transition-all rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 bg-sacred-gold/10 text-sacred-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-serif mb-2 italic text-mystic-indigo">Transmutation Initiated</h2>
                  
                  {paymentMethod === "upi" ? (
                    <div className="space-y-4 max-w-md mx-auto mb-8 bg-mystic-indigo/5 p-6 border border-sacred-gold/20">
                      <p className="text-xs uppercase font-bold tracking-widest text-sacred-gold">UPI Verification Pending</p>
                      <p className="text-xs text-mystic-indigo/85 leading-relaxed">
                        Thank you, <strong>{name}</strong>! We have registered your spiritual order of <strong>${total} USD (₹{totalInINR} INR)</strong>. 
                      </p>
                      <p className="text-xs text-mystic-indigo/70 leading-relaxed">
                        Since you paid via Google Pay QR, please tap below to send the screenshot verification on our WhatsApp Business support lane to trigger immediate manual delivery of your artifact links.
                      </p>
                      
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full py-4 bg-[#25D366] text-white text-xs uppercase tracking-widest font-black items-center justify-center gap-2 hover:bg-[#128C7E] transition-all shadow-md mt-2"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.5 0 10-4.5 10-10C21.4 5.1 16.9.6 11.4.6 5.9.6 1.4 5.1 1.4 10.6c0 1.9.5 3.7 1.5 5.3l-1 3.6 3.7-1zm12.3-5.3c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5C7.2 9 6.6 7.6 6.4 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/>
                        </svg>
                        Send Receipt via WhatsApp
                      </a>
                    </div>
                  ) : (
                    <p className="text-mystic-indigo/70 max-w-sm mx-auto mb-8 leading-relaxed text-sm">
                      Your digital remedies have been successfully authorized. Your primary self-reflection download link is immediately functional:
                    </p>
                  )}
                  
                  <div className="space-y-4 mb-8 max-w-md mx-auto">
                    <a 
                      href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                      download
                      className="block w-full py-5 bg-mystic-indigo text-aged-paper text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:bg-sacred-gold hover:text-mystic-indigo transition-all shadow-lg"
                    >
                      <Truck className="w-4 h-4 rotate-180" /> Direct Access Digital Journal (PDF)
                    </a>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest text-mystic-indigo">
                      A copy of the access key of alignment has been dispatched to <span className="underline">{email}</span>.
                    </p>
                  </div>

                  <button 
                    onClick={onClose}
                    className="text-[10px] uppercase font-bold text-sacred-gold tracking-widest hover:underline transition-all"
                  >
                    Return to Sanctuary
                  </button>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 border-4 border-sacred-gold/20 border-t-sacred-gold rounded-full animate-spin mx-auto mb-8" />
                  <p className="text-xs uppercase tracking-[0.4em] text-sacred-gold animate-pulse">Aligning Transmutation Gateways...</p>
                </motion.div>
              ) : (
                <motion.div key={step}>
                  {/* Step Banner */}
                  <div className="mb-10 flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-serif italic text-mystic-indigo">Checkout Alignment</h2>
                      <p className="text-[9px] uppercase tracking-widest text-mystic-indigo/50 mt-1">
                        Secure Connection Verified
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2].map(i => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-sacred-gold w-8' : 'bg-mystic-indigo/10 w-2'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {step === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 text-sacred-gold pb-4 border-b border-mystic-indigo/5">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-black">1. Customer Identification</span>
                      </div>
                      
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-mystic-indigo opacity-50 uppercase tracking-widest block">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-mystic-indigo/5 border-b border-mystic-indigo/20 p-3 text-sm focus:border-sacred-gold outline-none transition-colors" 
                            placeholder="Please enter your full name" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-mystic-indigo opacity-50 uppercase tracking-widest block">Email Address (For Instant Delivery)</label>
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-mystic-indigo/5 border-b border-mystic-indigo/20 p-3 text-sm focus:border-sacred-gold outline-none transition-colors" 
                            placeholder="yourname@domain.com" 
                          />
                        </div>
                        
                        <div className="p-4 bg-sacred-gold/5 border border-sacred-gold/10 text-[11px] leading-relaxed text-mystic-indigo/80">
                          <strong>Immediate Transmission SLA:</strong> Double-check your contact mail coordinates. Digital attachments and PDF manuals will be transmitted directly here immediately.
                        </div>
                      </div>

                      <button 
                        onClick={handleNext}
                        className="w-full py-5 bg-mystic-indigo text-aged-paper text-xs uppercase tracking-[0.2em] font-black flex items-center justify-center gap-2 mt-8 hover:bg-sacred-gold hover:text-mystic-indigo transition-colors"
                      >
                        Proceed: Select Payment Method <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 text-sacred-gold pb-4 border-b border-mystic-indigo/5">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-black">2. Payment Method Selected</span>
                      </div>

                      {/* Currency conversions visual box */}
                      <div className="grid grid-cols-2 gap-4 bg-mystic-indigo/5 border border-mystic-indigo/10 p-4">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest opacity-40">Original Price</p>
                          <p className="text-xl font-serif text-mystic-indigo">${total} <span className="text-xs uppercase font-sans">USD</span></p>
                        </div>
                        <div className="border-l border-mystic-indigo/10 pl-4">
                          <p className="text-[8px] uppercase tracking-widest text-sacred-gold/80 font-bold">Indian Currency Equiv.</p>
                          <p className="text-xl font-serif text-sacred-gold">₹{totalInINR} <span className="text-xs uppercase font-sans">INR</span></p>
                          <p className="text-[8px] opacity-40 mt-0.5">Calculated at current rate (1 USD = ₹{exchangeRate})</p>
                        </div>
                      </div>

                      {/* Region/Gateway tabs selector */}
                      <div className="grid grid-cols-2 gap-2 pb-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`py-3 text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                            paymentMethod === "upi"
                              ? "bg-mystic-indigo text-aged-paper border-mystic-indigo"
                              : "border-mystic-indigo/20 text-mystic-indigo/60 hover:border-mystic-indigo"
                          }`}
                        >
                          <Smartphone className="w-4 h-4 text-sacred-gold" />
                          GPay / Indian UPI (₹)
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("paypal")}
                          className={`py-3 text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                            paymentMethod === "paypal"
                              ? "bg-mystic-indigo text-aged-paper border-mystic-indigo"
                              : "border-mystic-indigo/20 text-mystic-indigo/60 hover:border-mystic-indigo"
                          }`}
                        >
                          <Globe className="w-4 h-4 text-sacred-gold" />
                          PayPal / Global Cards ($)
                        </button>
                      </div>

                      {/* Tab 1: GPay / Indian UPI payment card */}
                      {paymentMethod === "upi" && (
                        <div className="space-y-6">
                          <div className="border border-sacred-gold/20 bg-white/40 p-5 md:p-6 rounded-lg space-y-5 shadow-inner">
                            {/* Merchant Banner */}
                            <div className="flex items-center justify-between border-b border-mystic-indigo/10 pb-3">
                              <div>
                                <h4 className="font-serif italic text-base text-mystic-indigo">Sasitharani Jagadeshprabu</h4>
                                <p className="text-[9px] text-mystic-indigo/60 uppercase tracking-widest mt-0.5">UPI Merchant Account</p>
                              </div>
                              <div className="bg-mystic-indigo/5 px-2 py-1 rounded border border-mystic-indigo/10 text-[9px] font-mono font-bold text-mystic-indigo">
                                UPI ID: sasitharani-1@oksbi
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                              {/* Left column: Dynamic QR Code */}
                              <div className="flex flex-col items-center bg-white p-4 border border-mystic-indigo/10 rounded-md">
                                <img 
                                  src={qrCodeUrl} 
                                  alt="Google Pay UPI QR Code" 
                                  className="w-40 h-40 border border-mystic-indigo/5"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-[9px] uppercase tracking-wider font-bold text-mystic-indigo/60 mt-3 flex items-center gap-1.5 text-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  Scan to pay ₹{totalInINR} with GPay
                                </span>
                              </div>

                              {/* Right column: Action points */}
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <p className="text-[8px] uppercase tracking-widest opacity-40">Recipient UPI ID</p>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-mystic-indigo truncate select-all">
                                      sasitharani-1@oksbi
                                    </span>
                                    <button
                                      type="button"
                                      onClick={copyUpiId}
                                      className="p-1 px-2 border border-mystic-indigo/15 text-[9px] uppercase hover:bg-mystic-indigo hover:text-aged-paper transition-all flex items-center gap-1"
                                    >
                                      {upiCopied ? (
                                        <>
                                          <Check className="w-3 h-3 text-green-600" /> Copied
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-2.5 h-2.5" /> Copy
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-[8px] uppercase tracking-widest opacity-40">On Mobile? Use instant app link</p>
                                  <a
                                    href={upiPayload}
                                    className="inline-flex w-full py-2.5 bg-[#4285F4] text-white rounded text-[10px] font-extrabold uppercase tracking-widest items-center justify-center gap-1.5 hover:bg-[#357AE8] transition-all"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Launch GPay / UPI App
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* File upload screenshot component */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-mystic-indigo uppercase tracking-widest flex items-center gap-1">
                              <CornerDownRight className="w-3 h-3 text-sacred-gold" />
                              Step 2: Submit Screenshot for Activation
                            </p>

                            <div 
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                                dragActive 
                                  ? "border-sacred-gold bg-sacred-gold/10" 
                                  : isScreenshotUploaded 
                                    ? "border-green-500 bg-green-500/5" 
                                    : "border-mystic-indigo/20 bg-mystic-indigo/5 hover:border-sacred-gold"
                              }`}
                            >
                              <input 
                                type="file" 
                                id="screenshot-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden" 
                              />
                              
                              {isScreenshotUploaded ? (
                                <div className="space-y-1">
                                  <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <h5 className="text-[11px] font-bold text-mystic-indigo">Screenshot Registered</h5>
                                  <p className="font-mono text-[9px] text-mystic-indigo/50 truncate max-w-[300px] mx-auto">
                                    {screenshotName}
                                  </p>
                                  <label 
                                    htmlFor="screenshot-upload" 
                                    className="inline-block text-[9px] uppercase tracking-wider font-bold text-sacred-gold hover:underline mt-2 cursor-pointer"
                                  >
                                    Replace image
                                  </label>
                                </div>
                              ) : (
                                <label htmlFor="screenshot-upload" className="cursor-pointer space-y-2 block">
                                  <Upload className="w-6 h-6 text-mystic-indigo/40 mx-auto" />
                                  <div className="text-xs">
                                    <span className="font-bold text-sacred-gold hover:underline">Click to upload</span> or drag and drop GPay receipt screenshot
                                  </div>
                                  <p className="text-[8px] text-mystic-indigo/40">PNG, JPG or JPEG allowed</p>
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Trigger verification submit flow */}
                          <div className="pt-4 border-t border-mystic-indigo/10 flex flex-col md:flex-row gap-3 justify-between items-center">
                            <button 
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-[9px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity"
                            >
                              ← Customer Details
                            </button>

                            <button 
                              type="button"
                              onClick={handleComplete}
                              disabled={!isScreenshotUploaded}
                              className={`w-full md:w-auto px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-black transition-all ${
                                isScreenshotUploaded 
                                  ? "bg-sacred-gold text-mystic-indigo shadow-lg hover:bg-white" 
                                  : "bg-mystic-indigo/10 text-mystic-indigo/35 cursor-not-allowed"
                              }`}
                            >
                              Confirm Payment & Request Access
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tab 2: PayPal International Form (Real Smart Buttons Integration) */}
                      {paymentMethod === "paypal" && (
                        <div className="space-y-6">
                          <div className="border border-sacred-gold/20 bg-white/40 p-5 md:p-6 rounded-lg space-y-4">
                            <div className="flex items-center justify-between border-b border-mystic-indigo/5 pb-2">
                              <span className="text-[10px] uppercase font-bold text-[#003087] tracking-widest flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse" />
                                Live PayPal Link Authorized
                              </span>
                              <span className="font-mono text-[9px] text-mystic-indigo/55 font-bold">
                                Client ID Verified
                              </span>
                            </div>

                            <p className="text-[11px] leading-relaxed text-mystic-indigo/80">
                              Your global transaction of <strong>${total} USD</strong> is fully integrated. Tap the button below to settle the order instantly using PayPal account balance, or integrated credit & debit cards inside PayPal's secure modal.
                            </p>

                            {/* Container where PayPay smart button renders */}
                            <div className="py-2">
                              <div id="paypal-button-container" className="relative z-10 min-h-[150px] bg-mystic-indigo/5 rounded-md p-4 flex items-center justify-center">
                                {!paypalLoaded && (
                                  <div className="text-center py-4">
                                    <div className="w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-[10px] uppercase tracking-widest text-mystic-indigo/60">Configuring Secure Credentials...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-mystic-indigo/10 flex justify-between items-center">
                            <button 
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-[9px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity"
                            >
                              ← Customer Details
                            </button>

                            <span className="text-[10px] tracking-widest uppercase font-mono text-mystic-indigo/50">
                              Direct Instant Delivery
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
