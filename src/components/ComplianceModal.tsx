import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, ShieldAlert, FileClock, Ship, Mail, MapPin, Clock, Phone, Send, Check } from "lucide-react";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy" | "refund" | "shipping" | "contact";
}

export default function ComplianceModal({ isOpen, onClose, initialTab = "terms" }: ComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "refund" | "shipping" | "contact">(initialTab);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIsSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }
  }, [isOpen, initialTab]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const tabs = [
    { id: "terms", label: "Terms & Conditions", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: ShieldAlert },
    { id: "refund", label: "Refund & Cancellation", icon: FileClock },
    { id: "shipping", label: "Shipping & Delivery", icon: Ship },
    { id: "contact", label: "Contact Us", icon: Mail },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="compliance-modal-overlay" className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-mystic-indigo/95 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="relative w-full max-w-5xl h-full max-h-[85vh] bg-aged-paper border border-sacred-gold/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 text-mystic-indigo/60 hover:text-mystic-indigo hover:bg-mystic-indigo/5 rounded-full transition-all"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sidebar Navigation */}
            <div className="w-full md:w-80 bg-mystic-indigo/5 border-b md:border-b-0 md:border-r border-mystic-indigo/10 p-6 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif italic text-mystic-indigo">Grounding Center</h3>
                  <p className="text-[10px] text-mystic-indigo/40 uppercase tracking-widest mt-1">Official Site Compliance & Ethics</p>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all ${
                          isActive
                            ? "bg-mystic-indigo text-aged-paper border-l-4 border-sacred-gold pl-3"
                            : "text-mystic-indigo/60 hover:text-mystic-indigo hover:bg-mystic-indigo/5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-sacred-gold" : "opacity-60"}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="hidden md:block pt-6 border-t border-mystic-indigo/10">
                <p className="text-[10px] text-mystic-indigo/40 tracking-wider">
                  Mystic Artifacts Shop<br />
                  Secure SSL Encryption<br />
                  Verified Merchant Status
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar flex flex-col justify-between">
              <div className="prose prose-sm max-w-none text-mystic-indigo/80 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "terms" && (
                      <div className="space-y-6">
                        <div className="border-b border-mystic-indigo/10 pb-4">
                          <h2 className="text-3xl font-serif italic text-mystic-indigo">Terms & Conditions</h2>
                          <p className="text-xs text-mystic-indigo/40 mt-1">Last Updated: May 20, 2026</p>
                        </div>

                        <p className="text-sm leading-relaxed">
                          Welcome to <strong>Mystic Artifacts</strong>. These Terms & Conditions govern your access to and use of our digital items e-commerce storefront. By ordering, claiming free items, or using this platform, you agree to these terms in full.
                        </p>

                        <div className="space-y-4 text-sm leading-relaxed">
                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">1. Scope of Digital Service</h4>
                          <p>
                            Mystic Artifacts distributes digital download products, including self-reflection journals (PDF format), sound therapy loopable audios (MP3 format), and sanctuary wallpapers (MP4 format). These items are intended solely for personal, non-commercial use.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">2. Metaphysical & Spiritual Disclaimer</h4>
                          <p>
                            All content, spiritual names derived, and cosmic benefits described on this site are for personal reflective purposes, journaling meditation, and creative enjoyment. They are not to be taken as clinical psychological counsel, financial advisory, or medical therapy.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">3. Use Licenses</h4>
                          <p>
                            Upon claiming or buying any digital item, you are granted a single non-exclusive, non-transferable, revocable license to access and read the file on your electronic devices. You agree not to copy, duplicate, resell, redistribute, or pirate our digital goods.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">4. Governing Law & Jurisdiction</h4>
                          <p>
                            These terms shall be governed by and interpreted in accordance with the laws of India. Any legal actions or proceedings arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "privacy" && (
                      <div className="space-y-6">
                        <div className="border-b border-mystic-indigo/10 pb-4">
                          <h2 className="text-3xl font-serif italic text-mystic-indigo">Privacy Policy</h2>
                          <p className="text-xs text-mystic-indigo/40 mt-1">Last Updated: May 20, 2026</p>
                        </div>

                        <p className="text-sm leading-relaxed">
                          Your trust in our spiritual sanctuary is paramount. This Privacy Policy describes how we collect, store, and utilize your metadata when you browse or make orders.
                        </p>

                        <div className="space-y-4 text-sm leading-relaxed">
                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">1. Information We Collect</h4>
                          <p>
                            We collect contact coordinates, specifically your Full Name and Email Address, during the delivery checkout form. We also store logs of successfully claimed order items to enable digital download rendering.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">2. Safe Processing of Payments</h4>
                          <p>
                            All customer billing interactions are processed by third-party payment pathways (including standard credit card systems, PayPal, Razorpay, or cashfree gateways). We NEVER store, see, or transmit credit card details on our local server.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">3. How We Use Your Data</h4>
                          <p>
                            We use your email primarily to transmit the PDF, MP3, and MP4 links, trigger billing confirmations, and respond to support files. We do not sell or lease your metadata to third-party advertising companies.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">4. Cookies & Web Analytics</h4>
                          <p>
                            This site uses essential storage (local storage) to hold your digital cart status and custom journaling answers. No malicious tracking cookies are loaded on your device.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">5. Data Deletion Requests</h4>
                          <p>
                            You have the right to request the deletion of all purchase receipts associated with your email at any time. Simply make requests via support@mysticartifacts.co.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "refund" && (
                      <div className="space-y-6">
                        <div className="border-b border-mystic-indigo/10 pb-4">
                          <h2 className="text-3xl font-serif italic text-mystic-indigo">Refund & Cancellation Policy</h2>
                          <p className="text-xs text-mystic-indigo/40 mt-1 font-black">Strictly Compliant Gateway Terms</p>
                        </div>

                        <div className="bg-red-600/5 border border-red-600/10 p-4 font-serif italic text-xs leading-relaxed text-red-700">
                          Because these are digital downloads, we strongly suggest reviewing terms below before order alignment.
                        </div>

                        <div className="space-y-4 text-sm leading-relaxed">
                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">1. Digital Item Sales Finality</h4>
                          <p>
                            All items sold on Mystic Artifacts (including the "Cleanse Your Souls" premium journal, audio curative packages, and ambient desktop charging loops) are instant access digital items. 
                            <strong> Due to the intangible nature and immediate accessibility of digital downloads, ALL sales are final and non-refundable.</strong> Once an order is processed, no cancellations or refunds will be issued.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">2. Technical Difficulties & Corrupt Downloads</h4>
                          <p>
                            If you encounter any operational or technical error (such as a bad download link, empty receipt email, or corrupt PDF rendering), please reach out to our team at <strong>support@mysticartifacts.co</strong> within 7 days. We will immediately reissue the links or email you the files directly within 24 hours.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">3. Order Cancellations</h4>
                          <p>
                            Because digital links are transmitted in real-time instantly upon purchase, we are unable to process cancellation requests once the payment verification phase succeeds.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "shipping" && (
                      <div className="space-y-6">
                        <div className="border-b border-mystic-indigo/10 pb-4">
                          <h2 className="text-3xl font-serif italic text-mystic-indigo">Shipping & Delivery Policy</h2>
                          <p className="text-xs text-mystic-indigo/40 mt-1">Instant Digital Transfer SLA</p>
                        </div>

                        <p className="text-sm leading-relaxed">
                          Mystic Artifacts operates an <strong>all-digital sanctuary repository</strong>. We ship NO physical merchandise, boxes, paper journals, or equipment. Accordingly, no shipping fees, handling taxes, or delivery delay surcharges apply.
                        </p>

                        <div className="space-y-4 text-sm leading-relaxed">
                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">1. Immediate Transmission</h4>
                          <p>
                            Upon successful checkout completion and payment verification, your specific digital downloads are instantly generated. You will be redirected to an on-screen layout where you can instantly download the files.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">2. Automated Email SLA</h4>
                          <p>
                            In addition to the on-screen link, a backup download link is sent to the registered email address within <strong>1 to 5 minutes</strong> of order placement.
                          </p>

                          <h4 className="font-bold text-mystic-indigo uppercase tracking-wider text-xs">3. Blocked, Delayed or Lost Delivery</h4>
                          <p>
                            If you do not find the email receipt inside your main inbox within 10 minutes, kindly check your Spam, Junk, or Promotions folders. In rare instances, bank settlement clearance can delay link dispatch. For assistance, reach out directly with purchase details to <strong>support@mysticartifacts.co</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "contact" && (
                      <div className="space-y-6">
                        <div className="border-b border-mystic-indigo/10 pb-4">
                          <h2 className="text-3xl font-serif italic text-mystic-indigo">Contact Us</h2>
                          <p className="text-xs text-mystic-indigo/40 mt-1">Direct Gateway Compliance Support Channel</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Contact Info */}
                          <div className="space-y-6 bg-mystic-indigo/5 p-6 border border-mystic-indigo/10">
                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest text-sacred-gold font-bold mb-3">Merchant Coordinates</h4>
                              <div className="space-y-4 text-xs font-serif italic">
                                <div className="flex items-start gap-3">
                                  <Mail className="w-4 h-4 text-sacred-gold shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-sans not-italic font-bold text-mystic-indigo">E-commerce Support</p>
                                    <p className="text-mystic-indigo/80">support@mysticartifacts.co</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <Phone className="w-4 h-4 text-sacred-gold shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-sans not-italic font-bold text-mystic-indigo">Contact Hotlines</p>
                                    <p className="text-mystic-indigo/80">+91 98765 43210</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <Clock className="w-4 h-4 text-sacred-gold shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-sans not-italic font-bold text-mystic-indigo">Support Availability</p>
                                    <p className="text-mystic-indigo/80">Monday — Friday, 10:00 AM — 6:00 PM (IST)</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-sacred-gold shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-sans not-italic font-bold text-mystic-indigo">Physical Operating Address</p>
                                    <p className="text-mystic-indigo/80 not-italic font-sans text-[11px] leading-relaxed">
                                      <strong>Mystic Artifacts Office</strong><br />
                                      Sasitharani S, Proprietor<br />
                                      42, Leyline Avenue, Auroville<br />
                                      Viluppuram District, Tamil Nadu, 605101, India
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Interactive Contact Form */}
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-mystic-indigo/50 font-bold mb-4">Send an Instant transmission</h4>
                            
                            {isSubmitted ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-6 border border-sacred-gold/20 text-center space-y-4"
                              >
                                <div className="w-12 h-12 bg-sacred-gold/10 text-sacred-gold rounded-full flex items-center justify-center mx-auto">
                                  <Check className="w-6 h-6" />
                                </div>
                                <h5 className="font-serif italic text-lg">Transmission Sealed</h5>
                                <p className="text-xs text-mystic-indigo/60 leading-relaxed">
                                  We have received your message. Our grounding guides will respond via email inside 24 operating hours.
                                </p>
                              </motion.div>
                            ) : (
                              <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-mystic-indigo/50 mb-1">Your Sacred Name</label>
                                  <input
                                    type="text"
                                    required
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="w-full bg-mystic-indigo/5 border border-mystic-indigo/10 focus:border-sacred-gold outline-none p-3 text-xs transition-colors"
                                    placeholder="Enter full name"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-mystic-indigo/50 mb-1">Email Address</label>
                                  <input
                                    type="email"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full bg-mystic-indigo/5 border border-mystic-indigo/10 focus:border-sacred-gold outline-none p-3 text-xs transition-colors"
                                    placeholder="yourname@domain.com"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-mystic-indigo/50 mb-1">Inquiry / Question</label>
                                  <textarea
                                    required
                                    rows={4}
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full bg-mystic-indigo/5 border border-mystic-indigo/10 focus:border-sacred-gold outline-none p-3 text-xs transition-colors resize-none"
                                    placeholder="What questions do you have regarding delivery, checkout, or our digital offerings?"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="w-full py-3 bg-mystic-indigo text-aged-paper hover:bg-sacred-gold hover:text-mystic-indigo text-[10px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                      <span>Transmitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3 h-3" />
                                      <span>Submit Inquiry</span>
                                    </>
                                  )}
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-mystic-indigo/10 flex justify-between items-center text-[10px] opacity-40">
                <span>© 2026 Mystic Artifacts. Compliant Digital Storefront.</span>
                <button onClick={onClose} className="hover:underline hover:opacity-100 transition-all">Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
