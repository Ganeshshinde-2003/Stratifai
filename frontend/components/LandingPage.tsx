import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import CaseStudyModal from './CaseStudyModal';
import styles from '../styles/LandingPage.module.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

interface CaseStudy {
  title: string;
  type: string;
  productAnalyzed: {
    name: string;
    description: string;
  };
  toolUsed: {
    name: string;
    description: string;
  };
  whatIDid: {
    summary: string;
    outputsGenerated: string[];
  };
  keyInsight: {
    problem: string;
    newPositioning: string;
    reasoning: string;
  };
  sampleOutput: {
    adCopy: string;
  };
  whatWasMissingBefore: string[];
  founderFeedback: {
    role: string;
    quote: string;
  };
  impact: {
    timeToGenerateStrategy: string;
    benefits: string[];
  };
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  caseStudy?: CaseStudy;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { theme } = useTheme();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<{
    caseStudy: any;
    founderName: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + testimonials.length) % testimonials.length;
    setCurrentIndex(newIndex);
  };

  const getVisibleTestimonials = () => {
    const total = testimonials.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    return {
      prev: testimonials[prevIndex],
      current: testimonials[currentIndex],
      next: testimonials[nextIndex],
      prevIndex,
      currentIndex,
      nextIndex
    };
  };

  const features = [
    {
      title: 'Ad Copy That Converts',
      description: 'Get 5 professionally crafted ad variations optimized for different platforms and audiences. Each ad is designed to capture attention and drive action.',
      impact: 'Increase click-through rates by up to 3x with tested copy frameworks'
    },
    {
      title: 'Email Sequences That Engage',
      description: 'Receive 3 complete email sequences (welcome, nurture, conversion) with compelling subject lines and strategic CTAs.',
      impact: 'Boost email open rates by 40% and conversion rates by 25%'
    },
    {
      title: 'Landing Pages That Sell',
      description: 'Get a complete landing page structure with headlines, sections, and CTAs optimized for conversions.',
      impact: 'Improve landing page conversion rates by 2-3x with proven layouts'
    },
    {
      title: 'Social Media Content',
      description: 'Platform-specific content for Twitter, LinkedIn, and Instagram designed to build engagement and grow your audience.',
      impact: 'Increase social engagement by 5x and reach 10x more potential customers'
    },
    {
      title: 'SEO Optimization',
      description: 'Target keywords, meta tags, and heading structure to help you rank higher in search results.',
      impact: 'Drive 50% more organic traffic within 3-6 months'
    },
    {
      title: 'Competitor Analysis',
      description: 'Understand your competitive landscape and identify opportunities to differentiate your product.',
      impact: 'Find unique positioning angles that make your product stand out'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Enter Your Product',
      description: 'Paste your product URL or describe what you\'re selling in a few sentences.'
    },
    {
      step: '2',
      title: 'AI Analyzes & Strategizes',
      description: 'Our AI analyzes your product, audience, and market to create a comprehensive strategy.'
    },
    {
      step: '3',
      title: 'Get Your Marketing Kit',
      description: 'Receive complete marketing materials ready to use across all channels in 60-90 seconds.'
    },
    {
      step: '4',
      title: 'Launch & Grow',
      description: 'Deploy your marketing content and watch your business grow with data-driven strategies.'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: 'A very seamless platform to use. Generating a content strategy by simply adding a website link is incredibly efficient. The email template feature stands out and will save significant time.',
      name: 'Ishan Tandel',
      role: 'Founder @Srinova Design',
      caseStudy: {
        title: 'Srinova Design',
        type: 'Founder-led Case Study',
        productAnalyzed: {
          name: 'Srinova Design',
          description: 'A design-focused product built to help businesses strengthen their digital presence and branding experiences.'
        },
        toolUsed: {
          name: 'Stratifai',
          description: 'An AI platform that analyzes a website link to generate marketing strategy, assets, email templates, and competitor insights.'
        },
        whatIDid: {
          summary: 'I ran Srinova Design through Stratifai to evaluate and improve its marketing and positioning.',
          outputsGenerated: [
            'Marketing positioning',
            'Ad copy variations',
            'Landing page structure',
            'Email campaign templates',
            'Competitor analysis and positioning insights'
          ]
        },
        keyInsight: {
          problem: 'Srinova Design was positioned too broadly, similar to generic content and design tools.',
          newPositioning: 'An AI-powered growth assistant that turns any website into a ready-to-execute marketing strategy in seconds.',
          reasoning: 'Competitor analysis showed most tools focus only on content generation, while speed, clarity, and execution were under-owned value drivers.'
        },
        sampleOutput: {
          adCopy: 'Turn your website into a complete marketing strategy in seconds. No guesswork, just execution.'
        },
        whatWasMissingBefore: [
          'Clear niche targeting (founders vs marketers vs agencies)',
          'Strong differentiation from generic AI tools',
          'Clear emphasis on speed and execution',
          'Competitive contrast in messaging'
        ],
        founderFeedback: {
          role: 'Founder of Srinova Design',
          quote: 'The platform is extremely seamless to use. I got a full content strategy and competitor breakdown just by dropping in my website link. I personally really like the email template feature—it\'s going to save me a ton of time.'
        },
        impact: {
          timeToGenerateStrategy: 'Under 60 seconds',
          benefits: [
            'Generated a complete marketing strategy instantly',
            'Received actionable competitor positioning insights',
            'Replaced hours of manual research and planning',
            'Unlocked clearer and more differentiated product positioning'
          ]
        }
      }
    }
  ];

  return (
    <div className={styles.page}>
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <CaseStudyModal
          isOpen={true}
          onClose={() => setSelectedCaseStudy(null)}
          caseStudy={selectedCaseStudy.caseStudy}
          founderName={selectedCaseStudy.founderName}
        />
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logoContainer}>
            <img
              src={theme === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
              alt="Stratifai"
              className={styles.logoImage}
            />
            <span className={styles.logo}>Stratifai</span>
          </div>
          <button className={styles.navCTA} onClick={onGetStarted}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.heroTitle}>
              Complete Marketing Strategy
              <br />
              Generated in 60 Seconds
            </h1>
            <p className={styles.heroSubtitle}>
              From product description to full marketing strategy. Get ad copy, email sequences,
              landing pages, social content, and SEO optimization—all powered by AI.
            </p>
            <div className={styles.heroCTA}>
              <button className={styles.primaryButton} onClick={onGetStarted}>
                Create Your Strategy
              </button>
              <p className={styles.heroNote}>No credit card required. Start for free.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problem}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Marketing Challenge</h2>
          <p className={styles.sectionSubtitle}>
            Creating effective marketing takes time, expertise, and resources most teams don't have
          </p>
          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>Weeks of Work</h3>
              <p className={styles.problemText}>
                Writing ad copy, emails, landing pages, and social content takes 2-3 weeks minimum
              </p>
            </div>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>High Costs</h3>
              <p className={styles.problemText}>
                Hiring copywriters, designers, and strategists costs $5,000-$15,000 per campaign
              </p>
            </div>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>Inconsistent Results</h3>
              <p className={styles.problemText}>
                Without data-driven insights, most campaigns fail to deliver expected ROI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.solution}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Your Complete Marketing Kit, Instantly</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to launch and grow your product—generated in one click
          </p>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.featureNumber}>{(index + 1).toString().padStart(2, '0')}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureImpact}>
                  <span className={styles.impactLabel}>Growth Impact:</span>
                  <span className={styles.impactText}>{feature.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>60s</div>
              <div className={styles.statLabel}>Average Generation Time</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>15+</div>
              <div className={styles.statLabel}>Marketing Assets Created</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>3x</div>
              <div className={styles.statLabel}>Higher Conversion Rates</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$10k+</div>
              <div className={styles.statLabel}>Saved Per Campaign</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            From zero to complete marketing strategy in 4 simple steps
          </p>
          <div className={styles.stepsContainer}>
            {howItWorks.map((item, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.stepNumber}>{item.step}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDescription}>{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && <div className={styles.stepConnector} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Trusted by Founders</h2>
          <p className={styles.sectionSubtitle}>
            See what founders are saying about Stratifai
          </p>
          <div className={styles.carouselContainer}>
            {testimonials.length > 1 && (
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                onClick={() => paginate(-1)}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
            )}

            <div className={styles.carouselTrack}>
              {testimonials.length > 0 && (() => {
                const visible = getVisibleTestimonials();
                return (
                  <>
                    {/* Left (Previous) Testimonial */}
                    {testimonials.length > 1 && (
                      <motion.div
                        key={`left-${visible.prevIndex}`}
                        className={`${styles.testimonialCard} ${styles.testimonialSide}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.4, scale: 0.8, x: -280 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => paginate(-1)}
                      >
                        <div className={styles.quoteIcon}>"</div>
                        <p className={styles.testimonialQuote}>{visible.prev?.quote}</p>
                        <div className={styles.testimonialAuthor}>
                          <div className={styles.authorInfo}>
                            <p className={styles.authorName}>{visible.prev?.name}</p>
                            <p className={styles.authorRole}>{visible.prev?.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Center (Current) Testimonial */}
                    <motion.div
                      key={`center-${visible.currentIndex}`}
                      className={`${styles.testimonialCard} ${styles.testimonialCenter}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.quoteIcon}>"</div>
                      <p className={styles.testimonialQuote}>{visible.current?.quote}</p>
                      <div className={styles.testimonialAuthor}>
                        <div className={styles.authorInfo}>
                          <p className={styles.authorName}>{visible.current?.name}</p>
                          <p className={styles.authorRole}>{visible.current?.role}</p>
                        </div>
                      </div>
                      {visible.current?.caseStudy && (
                        <button
                          className={styles.caseStudyButton}
                          onClick={() => setSelectedCaseStudy({
                            caseStudy: visible.current.caseStudy,
                            founderName: visible.current.name
                          })}
                        >
                          <span className={styles.caseStudyIcon}>📊</span>
                          View Case Study by Founder
                        </button>
                      )}
                    </motion.div>

                    {/* Right (Next) Testimonial */}
                    {testimonials.length > 1 && (
                      <motion.div
                        key={`right-${visible.nextIndex}`}
                        className={`${styles.testimonialCard} ${styles.testimonialSide}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.4, scale: 0.8, x: 280 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => paginate(1)}
                      >
                        <div className={styles.quoteIcon}>"</div>
                        <p className={styles.testimonialQuote}>{visible.next?.quote}</p>
                        <div className={styles.testimonialAuthor}>
                          <div className={styles.authorInfo}>
                            <p className={styles.authorName}>{visible.next?.name}</p>
                            <p className={styles.authorRole}>{visible.next?.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}
            </div>

            {testimonials.length > 1 && (
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                onClick={() => paginate(1)}
                aria-label="Next testimonial"
              >
                ›
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Marketing?</h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of businesses using AI to accelerate their growth
          </p>
          <button className={styles.ctaButton} onClick={onGetStarted}>
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h3 className={styles.footerLogo}>Stratifai</h3>
              <p className={styles.footerTagline}>
                AI-powered marketing strategies for modern businesses
              </p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4 className={styles.footerColumnTitle}>Product</h4>
                <a href="#features" className={styles.footerLink}>Features</a>
                <a href="#how-it-works" className={styles.footerLink}>How It Works</a>
                <a href="#pricing" className={styles.footerLink}>Pricing</a>
              </div>
              <div className={styles.footerColumn}>
                <h4 className={styles.footerColumnTitle}>Company</h4>
                <a href="#about" className={styles.footerLink}>About</a>
                <a href="#blog" className={styles.footerLink}>Blog</a>
                <a href="#contact" className={styles.footerLink}>Contact</a>
              </div>
              <div className={styles.footerColumn}>
                <h4 className={styles.footerColumnTitle}>Legal</h4>
                <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
                <a href="#terms" className={styles.footerLink}>Terms of Service</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              © 2024 Stratifai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
