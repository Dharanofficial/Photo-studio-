
import { useState } from 'react';

import PortfolioCard from '../components/PortfolioCard';
import ServiceCard from '../components/ServiceCard';
import PackageCard from '../components/PackageCard';

import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

import { useResource } from '../services/useResource';

import {
  portfolioService,
  serviceService,
  packageService,
  inquiryService,
} from '../services/resources';

import { useApp } from '../context/AppContext';


// ============================================================
// CONSTANTS
// ============================================================

export const CATS = [
  'Wedding',
  'Pre-Wedding',
  'Portrait',
  'Events',
  'Fashion',
  'Product',
  'Birthday',
];


// ============================================================
// COMMON COMPONENTS
// ============================================================

const Head = ({ t, s }) => (
  <header className="phead">
    <div className="container">

      <p className="eyebrow">
        PHOTO STUDIO
      </p>

      <h1>{t}</h1>

      <p>{s}</p>

    </div>
  </header>
);


const Wrap = ({ resource, children }) => {

  if (resource.loading) {
    return <Loading />;
  }


  if (resource.error) {
    return (
      <EmptyState title={resource.error}>
        {resource.reload && (
          <Button onClick={resource.reload}>
            Retry
          </Button>
        )}
      </EmptyState>
    );
  }


  return children;
};


const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString('en-IN')}`;


// ============================================================
// PORTFOLIO
// ============================================================

export function Portfolio() {

  const resource = useResource(portfolioService);

  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);


  const portfolio = resource.items.filter(
    (item) =>
      item.status === 'Published' &&
      (
        category === 'All' ||
        item.category === category
      )
  );


  return (
    <>
      <Head
        t="Our Portfolio"
        s="A curated collection of moments, stories, and memories."
      />


      <section className="section">

        <div className="container">

          {/* Category Filter */}

          <div
            className="tabs"
            role="tablist"
            aria-label="Portfolio categories"
          >

            {['All', ...CATS].map((item) => (

              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={item === category}
                className={
                  item === category
                    ? 'on'
                    : ''
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>

            ))}

          </div>


          <Wrap resource={resource}>

            {portfolio.length > 0 ? (

              <div className="mason">

                {portfolio.map((item) => (

                  <PortfolioCard
                    key={item.id}
                    item={item}
                    onView={setSelected}
                  />

                ))}

              </div>

            ) : (

              <EmptyState
                title="No photos found"
              >
                <p>
                  There are no published photos in this category yet.
                </p>
              </EmptyState>

            )}

          </Wrap>

        </div>

      </section>


      {/* Portfolio Preview */}

      {selected && (

        <Modal
          dark
          wide
          title={`${selected.title} · ${selected.category}`}
          onClose={() => setSelected(null)}
        >

          <img
            className="full"
            src={selected.image}
            alt={selected.title}
          />

          {selected.description && (
            <p className="muted">
              {selected.description}
            </p>
          )}

        </Modal>

      )}

    </>
  );
}


// ============================================================
// SERVICES
// ============================================================

export function Services() {

  const resource = useResource(serviceService);

  const [selected, setSelected] = useState(null);


  const services = resource.items.filter(
    (service) =>
      service.status === 'Active'
  );


  return (
    <>
      <Head
        t="Photography Services"
        s="Professional photography tailored to every occasion."
      />


      <section className="section">

        <div className="container">

          <Wrap resource={resource}>

            {services.length > 0 ? (

              <div className="grid">

                {services.map((service) => (

                  <ServiceCard
                    key={service.id}
                    s={service}
                    onDetails={setSelected}
                  />

                ))}

              </div>

            ) : (

              <EmptyState
                title="No services available"
              >
                <p>
                  Photography services will appear here soon.
                </p>
              </EmptyState>

            )}

          </Wrap>

        </div>

      </section>


      {/* Service Details */}

      {selected && (

        <Modal
          title={selected.name}
          onClose={() => setSelected(null)}
        >

          {selected.description && (
            <p>
              {selected.description}
            </p>
          )}


          {selected.duration && (
            <p>
              <b>Duration:</b>{' '}
              {selected.duration}
            </p>
          )}


          <p className="price">
            From {formatPrice(selected.price)}
          </p>


          {selected.features?.length > 0 && (

            <ul className="ticks">

              {selected.features.map(
                (feature, index) => (

                  <li
                    key={`${feature}-${index}`}
                  >
                    {feature}
                  </li>

                )
              )}

            </ul>

          )}


          <Button
            to={`/book?type=${encodeURIComponent(
              selected.name
            )}`}
          >
            Book This Service
          </Button>

        </Modal>

      )}

    </>
  );
}


// ============================================================
// PACKAGES
// ============================================================

export function Packages() {

  const resource = useResource(packageService);

  const [selected, setSelected] = useState(null);


  const packages = resource.items.filter(
    (pkg) =>
      pkg.status === 'Active'
  );


  return (
    <>
      <Head
        t="Photography Packages"
        s="Transparent pricing designed around your photography needs."
      />


      <section className="section">

        <div className="container">

          <Wrap resource={resource}>

            {packages.length > 0 ? (

              <div className="grid">

                {packages.map((pkg) => (

                  <PackageCard
                    key={pkg.id}
                    p={pkg}
                    onDetails={setSelected}
                  />

                ))}

              </div>

            ) : (

              <EmptyState
                title="No packages available"
              >
                <p>
                  Our photography packages will be available soon.
                </p>
              </EmptyState>

            )}

          </Wrap>

        </div>

      </section>


      {/* Package Details */}

      {selected && (

        <Modal
          title={`${selected.name} Package`}
          onClose={() => setSelected(null)}
        >

          <p className="amt">
            {formatPrice(selected.price)}
          </p>


          {selected.features?.length > 0 && (

            <ul className="ticks">

              {selected.features.map(
                (feature, index) => (

                  <li
                    key={`${feature}-${index}`}
                  >
                    {feature}
                  </li>

                )
              )}

            </ul>

          )}


          <Button
            to={`/book?package=${encodeURIComponent(
              selected.name
            )}`}
          >
            Book This Package
          </Button>

        </Modal>

      )}

    </>
  );
}


// ============================================================
// ABOUT
// ============================================================

export function About() {

  return (
    <>
      <Head
        t="About Us"
        s="A small team with a big passion for storytelling."
      />


      <section className="section">

        <div className="container narrow">

          <div className="about-content">

            <p>
              <strong>PHOTO STUDIO</strong> was founded on
              a simple idea: your most important days
              deserve to be remembered honestly and beautifully.
            </p>


            <p>
              Our photographers blend documentary
              instinct with a refined editing style,
              delivering galleries you will want to revisit
              for decades.
            </p>


            <p>
              From intimate portraits to multi-day weddings,
              we plan each shoot with you, arrive prepared,
              and stay out of the way of the moment.
            </p>


            <div className="about-highlights">

              <div className="card">

                <h3>
                  Authentic Moments
                </h3>

                <p>
                  We focus on natural expressions,
                  genuine emotions, and real stories.
                </p>

              </div>


              <div className="card">

                <h3>
                  Professional Quality
                </h3>

                <p>
                  Every gallery receives careful
                  professional editing and finishing.
                </p>

              </div>


              <div className="card">

                <h3>
                  Personal Approach
                </h3>

                <p>
                  Every photography session is planned
                  around your unique requirements.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}


// ============================================================
// CONTACT
// ============================================================

export function Contact() {

  const { toast } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const [busy, setBusy] = useState(false);


  const updateField = (field) => (event) => {

    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));


    if (errors[field]) {

      setErrors((current) => ({
        ...current,
        [field]: '',
      }));

    }

  };


  const validate = () => {

    const validation = {};


    if (!form.name.trim()) {
      validation.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      validation.name = 'Name must contain at least 2 characters';
    }


    if (!form.email.trim()) {

      validation.email = 'Email is required';

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {

      validation.email =
        'Please enter a valid email address';

    }


    if (!form.phone.trim()) {
      validation.phone = 'Phone number is required';
    }


    if (!form.subject.trim()) {
      validation.subject = 'Subject is required';
    }


    if (form.message.trim().length < 10) {
      validation.message =
        'Please write at least 10 characters';
    }


    return validation;
  };


  const submit = async (event) => {

    event.preventDefault();


    const validation = validate();

    setErrors(validation);


    if (Object.keys(validation).length > 0) {
      return;
    }


    setBusy(true);


    try {

      await inquiryService.create({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        status: 'New',
      });


      toast(
        'Your message has been sent successfully'
      );


      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setErrors({});

    } catch (error) {

      console.error(
        'Inquiry submission failed:',
        error
      );

      toast(
        'Something went wrong. Please try again.',
        'err'
      );

    } finally {

      setBusy(false);

    }

  };


  return (
    <>
      <Head
        t="Contact Us"
        s="Tell us about your event and let us help bring your story to life."
      />


      <section className="section">

        <div className="container narrow">

          <div className="contact-intro">

            <h2>
              Let's Create Something Beautiful
            </h2>

            <p className="muted">
              Share your event details with us.
              Our team will get back to you as soon
              as possible.
            </p>

          </div>


          <form
            className="card pad form"
            onSubmit={submit}
            noValidate
          >

            <div className="grid2">

              <Input
                label="Full Name"
                value={form.name}
                onChange={updateField('name')}
                error={errors.name}
                required
              />


              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                error={errors.email}
                required
              />


              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                error={errors.phone}
                required
              />


              <Input
                label="Subject"
                value={form.subject}
                onChange={updateField('subject')}
                error={errors.subject}
                required
              />

            </div>


            <Input
              area
              label="Message"
              value={form.message}
              onChange={updateField('message')}
              error={errors.message}
              required
            />


            <div className="form-actions">

              <Button
                disabled={busy}
              >
                {busy
                  ? 'Sending…'
                  : 'Send Message'}
              </Button>

            </div>

          </form>

        </div>

      </section>

    </>
  );
}
