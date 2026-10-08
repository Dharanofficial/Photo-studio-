
import { useMemo, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useResource } from '../services/useResource';

import {
  bookingService,
  inquiryService,
  portfolioService,
  serviceService,
  packageService,
} from '../services/resources';

import StatCard from '../admin/StatCard';
import BookingTable from '../admin/BookingTable';
import InquiryTable from '../admin/InquiryTable';
import DataTable from '../admin/DataTable';
import Manager from '../admin/Manager';

import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';

import { CATS } from './Public';


// ============================================================
// CONSTANTS
// ============================================================

export const BSTATUS = [
  'Pending',
  'Confirmed',
  'In Progress',
  'Completed',
  'Cancelled',
];


// ============================================================
// HELPERS
// ============================================================

const countStatus = (items = [], status) =>
  items.filter((item) => item.status === status).length;

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ErrorState = ({ resource }) => {
  if (!resource?.error) return null;

  return (
    <div className="card empty">
      <p>{resource.error}</p>

      {resource.reload && (
        <Button onClick={resource.reload}>
          Retry
        </Button>
      )}
    </div>
  );
};


// ============================================================
// CUSTOMER DASHBOARD
// ============================================================

export function CustDashboard() {
  const { user } = useApp();

  const resource = useResource(bookingService);

  const mine = useMemo(
    () =>
      resource.items.filter(
        (booking) => booking.email === user?.email
      ),
    [resource.items, user?.email]
  );

  if (resource.loading) {
    return <Loading n={4} />;
  }

  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer Dashboard</p>

          <h2>
            Welcome back, {user?.name || 'Customer'}
          </h2>

          <p className="muted">
            Manage your photography bookings and inquiries.
          </p>
        </div>

        <Button to="/book">
          + New Booking
        </Button>
      </div>


      <ErrorState resource={resource} />


      <div className="stats">

        <StatCard
          label="Total Bookings"
          value={mine.length}
        />

        <StatCard
          label="Pending Bookings"
          value={countStatus(mine, 'Pending')}
        />

        <StatCard
          label="Confirmed Bookings"
          value={countStatus(mine, 'Confirmed')}
        />

        <StatCard
          label="Completed Sessions"
          value={countStatus(mine, 'Completed')}
        />

      </div>


      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h3>Recent Bookings</h3>

            <p className="muted">
              Your latest photography booking requests.
            </p>
          </div>

          <Button
            to="/customer/bookings"
            variant="ghost"
          >
            View All
          </Button>
        </div>


        {mine.length > 0 ? (
          <BookingTable rows={mine.slice(0, 5)} />
        ) : (
          <div className="card empty">
            <h3>No bookings yet</h3>

            <p>
              Start by creating your first photography booking.
            </p>

            <Button to="/book">
              Book a Session
            </Button>
          </div>
        )}

      </section>

    </div>
  );
}


// ============================================================
// CUSTOMER BOOKINGS
// ============================================================

export function CustBookings() {
  const { user, toast } = useApp();

  const resource = useResource(bookingService);

  const mine = useMemo(
    () =>
      resource.items.filter(
        (booking) => booking.email === user?.email
      ),
    [resource.items, user?.email]
  );


  const cancelBooking = async (booking) => {
    try {
      await resource.update(booking.id, {
        status: 'Cancelled',
      });

      toast('Booking cancelled successfully');
    } catch {
      toast('Unable to cancel booking');
    }
  };


  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer Area</p>

          <h2>My Bookings</h2>

          <p className="muted">
            View and manage your photography sessions.
          </p>
        </div>

        <Button to="/book">
          + New Booking
        </Button>
      </div>


      <ErrorState resource={resource} />


      {resource.loading ? (
        <Loading n={3} />
      ) : mine.length > 0 ? (
        <BookingTable
          rows={mine}
          actions={(booking) =>
            ['Pending', 'Confirmed'].includes(booking.status) && (
              <button
                className="d"
                onClick={() => cancelBooking(booking)}
              >
                Cancel
              </button>
            )
          }
        />
      ) : (
        <div className="card empty">
          <h3>No bookings found</h3>

          <p>
            You have not created any photography bookings yet.
          </p>
        </div>
      )}

    </div>
  );
}


// ============================================================
// CUSTOMER INQUIRIES
// ============================================================

export function CustInquiries() {
  const { user } = useApp();

  const resource = useResource(inquiryService);

  const mine = resource.items.filter(
    (inquiry) => inquiry.email === user?.email
  );


  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer Area</p>

          <h2>My Inquiries</h2>

          <p className="muted">
            Track your messages and photography inquiries.
          </p>
        </div>

        <Button to="/contact">
          + New Inquiry
        </Button>
      </div>


      <ErrorState resource={resource} />


      {resource.loading ? (
        <Loading n={3} />
      ) : mine.length > 0 ? (
        <InquiryTable rows={mine} />
      ) : (
        <div className="card empty">
          <h3>No inquiries yet</h3>

          <p>
            Contact the studio if you have any questions.
          </p>

          <Button to="/contact">
            Contact Studio
          </Button>
        </div>
      )}

    </div>
  );
}


// ============================================================
// CUSTOMER PROFILE
// ============================================================

export function CustProfile() {
  const { user, saveUser, toast } = useApp();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [error, setError] = useState('');


  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };


  const save = (event) => {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setError('Please enter a valid name');
      return;
    }

    setError('');

    saveUser({
      ...user,
      ...form,
    });

    toast('Profile updated successfully');
  };


  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>

          <h2>My Profile</h2>

          <p className="muted">
            Manage your personal information.
          </p>
        </div>
      </div>


      <form
        className="card pad form narrow0"
        onSubmit={save}
      >

        <Input
          label="Name"
          value={form.name}
          onChange={(event) =>
            updateField('name', event.target.value)
          }
          error={error}
        />

        <Input
          label="Email"
          value={form.email}
          disabled
        />

        <Input
          label="Phone"
          value={form.phone}
          onChange={(event) =>
            updateField('phone', event.target.value)
          }
        />

        <Button>
          Save Profile
        </Button>

      </form>

    </div>
  );
}


// ============================================================
// CUSTOMER SETTINGS
// ============================================================

export function Prefs() {
  const { toast } = useApp();

  const settings = [
    'Email notifications',
    'SMS reminders',
    'Marketing updates',
  ];


  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>

          <h2>Settings</h2>

          <p className="muted">
            Manage your communication preferences.
          </p>
        </div>
      </div>


      <div className="card pad form narrow0">

        {settings.map((setting) => (
          <label
            className="chk"
            key={setting}
          >
            <input
              type="checkbox"
              defaultChecked
              onChange={() =>
                toast('Setting saved successfully')
              }
            />

            {setting}
          </label>
        ))}

      </div>

    </div>
  );
}


// ============================================================
// ADMIN DASHBOARD
// ============================================================

export function AdminDashboard() {
  const bookings = useResource(bookingService);
  const inquiries = useResource(inquiryService);
  const packages = useResource(packageService);

  const loading =
    bookings.loading ||
    inquiries.loading ||
    packages.loading;


  const customers = new Set(
    bookings.items.map((booking) => booking.email)
  ).size;


  return (
    <div className="dashboard-page">

      <div className="page-heading">
        <div>
          <p className="eyebrow">Administration</p>

          <h2>Dashboard</h2>

          <p className="muted">
            Monitor your photography business performance.
          </p>
        </div>
      </div>


      <ErrorState resource={bookings} />
      <ErrorState resource={inquiries} />
      <ErrorState resource={packages} />


      {loading ? (
        <Loading n={6} />
      ) : (
        <>

          {/* Statistics */}

          <div className="stats">

            <StatCard
              label="Total Customers"
              value={customers}
            />

            <StatCard
              label="Total Bookings"
              value={bookings.items.length}
            />

            <StatCard
              label="Pending Bookings"
              value={countStatus(
                bookings.items,
                'Pending'
              )}
            />

            <StatCard
              label="Confirmed Bookings"
              value={countStatus(
                bookings.items,
                'Confirmed'
              )}
            />

            <StatCard
              label="Total Inquiries"
              value={inquiries.items.length}
            />

            <StatCard
              label="Total Packages"
              value={packages.items.length}
            />

          </div>


          {/* Quick Actions */}

          <section className="dashboard-section">

            <div className="section-heading">
              <div>
                <h3>Quick Actions</h3>

                <p className="muted">
                  Manage your studio content and bookings.
                </p>
              </div>
            </div>


            <div className="row">

              <Button to="/admin/portfolio">
                + Portfolio
              </Button>

              <Button
                to="/admin/bookings"
                variant="ghost"
              >
                Manage Bookings
              </Button>

              <Button
                to="/admin/packages"
                variant="ghost"
              >
                Manage Packages
              </Button>

            </div>

          </section>


          {/* Recent Activity */}

          <div className="two">

            <section>

              <div className="section-heading">
                <div>
                  <h3>Recent Bookings</h3>

                  <p className="muted">
                    Latest customer booking activity.
                  </p>
                </div>

                <Button
                  to="/admin/bookings"
                  variant="ghost"
                >
                  View All
                </Button>
              </div>

              <BookingTable
                rows={bookings.items.slice(0, 4)}
              />

            </section>


            <section>

              <div className="section-heading">
                <div>
                  <h3>Recent Inquiries</h3>

                  <p className="muted">
                    Latest customer messages.
                  </p>
                </div>

                <Button
                  to="/admin/inquiries"
                  variant="ghost"
                >
                  View All
                </Button>
              </div>

              <InquiryTable
                rows={inquiries.items.slice(0, 4)}
              />

            </section>

          </div>


          {/* Booking Status */}

          <section className="dashboard-section">

            <div className="section-heading">
              <div>
                <h3>Booking Status Overview</h3>

                <p className="muted">
                  Current booking distribution.
                </p>
              </div>
            </div>


            <div className="card pad">

              {BSTATUS.map((status) => {

                const count = countStatus(
                  bookings.items,
                  status
                );

                const percentage = bookings.items.length
                  ? (count / bookings.items.length) * 100
                  : 0;

                return (
                  <div
                    className="bar"
                    key={status}
                  >

                    <span>{status}</span>

                    <i
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                    <b>{count}</b>

                  </div>
                );
              })}

            </div>

          </section>

        </>
      )}

    </div>
  );
}


// ============================================================
// ADMIN PORTFOLIO
// ============================================================

export const AdminPortfolio = () => (
  <Manager
    svc={portfolioService}
    title="Portfolio"
    noun="Portfolio item"
    statusOptions={['Published', 'Draft']}
    filterKey="category"
    filterOptions={CATS}

    fields={[
      {
        key: 'title',
        label: 'Title',
        required: true,
      },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: CATS,
        required: true,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
      },
      {
        key: 'image',
        label: 'Image',
        type: 'image',
        required: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['Published', 'Draft'],
      },
    ]}

    columns={[
      {
        label: 'Image',
        render: (row) => (
          <img
            className="mini"
            src={row.image}
            alt={row.title || 'Portfolio'}
          />
        ),
      },
      {
        key: 'title',
        label: 'Title',
      },
      {
        key: 'category',
        label: 'Category',
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`badge ${row.status}`}>
            {row.status}
          </span>
        ),
      },
    ]}
  />
);


// ============================================================
// ADMIN SERVICES
// ============================================================

export const AdminServices = () => (
  <Manager
    svc={serviceService}
    title="Services"
    noun="Service"
    statusOptions={['Active', 'Inactive']}

    fields={[
      {
        key: 'name',
        label: 'Service name',
        required: true,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
      },
      {
        key: 'price',
        label: 'Price (₹)',
        type: 'number',
        required: true,
      },
      {
        key: 'duration',
        label: 'Duration',
      },
      {
        key: 'features',
        label: 'Features',
        type: 'features',
      },
      {
        key: 'image',
        label: 'Image',
        type: 'image',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['Active', 'Inactive'],
      },
    ]}

    columns={[
      {
        label: 'Image',
        render: (row) => (
          <img
            className="mini"
            src={row.image}
            alt={row.name || 'Service'}
          />
        ),
      },
      {
        key: 'name',
        label: 'Service',
      },
      {
        label: 'Price',
        render: (row) => money(row.price),
      },
      {
        key: 'duration',
        label: 'Duration',
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`badge ${row.status}`}>
            {row.status}
          </span>
        ),
      },
    ]}
  />
);


// ============================================================
// ADMIN PACKAGES
// ============================================================

export const AdminPackages = () => (
  <Manager
    svc={packageService}
    title="Packages"
    noun="Package"
    statusOptions={['Active', 'Inactive']}

    fields={[
      {
        key: 'name',
        label: 'Package name',
        required: true,
      },
      {
        key: 'price',
        label: 'Price (₹)',
        type: 'number',
        required: true,
      },
      {
        key: 'features',
        label: 'Features',
        type: 'features',
      },
      {
        key: 'popular',
        label: 'Mark as Most Popular',
        type: 'checkbox',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['Active', 'Inactive'],
      },
    ]}

    columns={[
      {
        key: 'name',
        label: 'Package',
      },
      {
        label: 'Price',
        render: (row) => money(row.price),
      },
      {
        label: 'Popular',
        render: (row) =>
          row.popular
            ? '★ Most Popular'
            : '—',
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`badge ${row.status}`}>
            {row.status}
          </span>
        ),
      },
    ]}
  />
);


// ============================================================
// ADMIN BOOKINGS
// ============================================================

export function AdminBookings() {
  const resource = useResource(bookingService);
  const { toast } = useApp();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [view, setView] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);


  const rows = useMemo(() => {

    const search = query.trim().toLowerCase();

    return resource.items.filter((booking) => {

      const searchable = [
        booking.name,
        booking.ref,
        booking.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !search || searchable.includes(search);

      const matchesStatus =
        !status || booking.status === status;

      const matchesDate =
        !date || booking.date === date;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });

  }, [
    resource.items,
    query,
    status,
    date,
  ]);


  const updateStatus = async (booking, value) => {

    try {

      await resource.update(
        booking.id,
        { status: value }
      );

      toast('Booking status updated successfully');

    } catch {

      toast('Unable to update booking status');

    }
  };


  const deleteBooking = async () => {

    if (!deleteItem) return;

    try {

      await resource.remove(deleteItem.id);

      setDeleteItem(null);

      toast('Booking deleted successfully');

    } catch {

      toast('Unable to delete booking');

    }
  };


  return (
    <div className="dashboard-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">Administration</p>

          <h2>Bookings</h2>

          <p className="muted">
            Manage customer photography bookings.
          </p>
        </div>

      </div>


      <ErrorState resource={resource} />


      <div className="card filters">

        <input
          className="search"
          placeholder="Search name, reference, email..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />


        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          {BSTATUS.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>


        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
        />

      </div>


      {resource.loading ? (
        <Loading n={3} />
      ) : rows.length > 0 ? (

        <BookingTable
          rows={rows}

          actions={(booking) => (
            <>
              <button
                onClick={() =>
                  setView(booking)
                }
              >
                View
              </button>


              <select
                value={booking.status}
                onChange={(event) =>
                  updateStatus(
                    booking,
                    event.target.value
                  )
                }
              >

                {BSTATUS.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>


              <button
                className="d"
                onClick={() =>
                  setDeleteItem(booking)
                }
              >
                Delete
              </button>
            </>
          )}
        />

      ) : (

        <div className="card empty">
          <h3>No bookings found</h3>

          <p>
            Try changing your search or filter.
          </p>
        </div>

      )}


      {/* Booking Details Modal */}

      {view && (
        <Modal
          title={`Booking ${view.ref || ''}`}
          onClose={() => setView(null)}
        >

          <table className="kv">

            <tbody>

              {[
                ['Customer', view.name],
                ['Email', view.email],
                ['Phone', view.phone],
                ['Event', view.type],
                ['Package', view.package],
                [
                  'Date',
                  `${view.date || ''} ${view.time || ''}`,
                ],
                ['Location', view.location],
                ['Guests', view.guests],
                ['Notes', view.notes],
                ['Status', view.status],
              ].map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value || '—'}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </Modal>
      )}


      {/* Delete Confirmation */}

      {deleteItem && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteItem(null)}
        >

          <p>
            Are you sure you want to delete this booking?
          </p>

          <div className="row end">

            <Button
              variant="ghost"
              onClick={() =>
                setDeleteItem(null)
              }
            >
              Cancel
            </Button>

            <Button
              className="danger"
              onClick={deleteBooking}
            >
              Delete
            </Button>

          </div>

        </Modal>
      )}

    </div>
  );
}


// ============================================================
// ADMIN INQUIRIES
// ============================================================

export function AdminInquiries() {
  const resource = useResource(inquiryService);
  const { toast } = useApp();

  const [view, setView] = useState(null);
  const [reply, setReply] = useState(null);
  const [message, setMessage] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);


  const markAsRead = async (inquiry) => {

    try {

      await resource.update(
        inquiry.id,
        { status: 'Read' }
      );

      toast('Inquiry marked as read');

    } catch {

      toast('Unable to update inquiry');

    }
  };


  const sendReply = async () => {

    if (!reply || !message.trim()) return;

    try {

      await resource.update(
        reply.id,
        { status: 'Replied' }
      );

      setReply(null);
      setMessage('');

      toast('Reply sent successfully');

    } catch {

      toast('Unable to send reply');

    }
  };


  const deleteInquiry = async () => {

    if (!deleteItem) return;

    try {

      await resource.remove(deleteItem.id);

      setDeleteItem(null);

      toast('Inquiry deleted successfully');

    } catch {

      toast('Unable to delete inquiry');

    }
  };


  return (
    <div className="dashboard-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">Administration</p>

          <h2>Customer Inquiries</h2>

          <p className="muted">
            Review and manage customer messages.
          </p>
        </div>

      </div>


      <ErrorState resource={resource} />


      {resource.loading ? (
        <Loading n={3} />
      ) : resource.items.length > 0 ? (

        <InquiryTable
          rows={resource.items}

          actions={(inquiry) => (
            <>

              <button
                onClick={() => {
                  setView(inquiry);

                  if (inquiry.status === 'New') {
                    markAsRead(inquiry);
                  }
                }}
              >
                View
              </button>


              <button
                onClick={() =>
                  markAsRead(inquiry)
                }
              >
                Mark Read
              </button>


              <button
                onClick={() => {
                  setReply(inquiry);
                  setMessage('');
                }}
              >
                Reply
              </button>


              <button
                className="d"
                onClick={() =>
                  setDeleteItem(inquiry)
                }
              >
                Delete
              </button>

            </>
          )}
        />

      ) : (

        <div className="card empty">
          <h3>No inquiries</h3>

          <p>
            Customer inquiries will appear here.
          </p>
        </div>

      )}


      {/* Inquiry Details */}

      {view && (
        <Modal
          title={view.subject || 'Inquiry'}
          onClose={() => setView(null)}
        >

          <p>
            <b>{view.name}</b>
            {' · '}
            {view.email}
            {' · '}
            {view.phone}
          </p>

          <p>
            {view.message}
          </p>

        </Modal>
      )}


      {/* Reply Modal */}

      {reply && (
        <Modal
          title={`Reply to ${reply.name}`}
          onClose={() => setReply(null)}
        >

          <Input
            area
            label="Message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
          />

          <div className="row end">

            <Button
              disabled={!message.trim()}
              onClick={sendReply}
            >
              Send Reply
            </Button>

          </div>

        </Modal>
      )}


      {/* Delete Modal */}

      {deleteItem && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteItem(null)}
        >

          <p>
            Are you sure you want to delete this inquiry?
          </p>

          <div className="row end">

            <Button
              variant="ghost"
              onClick={() =>
                setDeleteItem(null)
              }
            >
              Cancel
            </Button>

            <Button
              className="danger"
              onClick={deleteInquiry}
            >
              Delete
            </Button>

          </div>

        </Modal>
      )}

    </div>
  );
}


// ============================================================
// ADMIN CUSTOMERS
// ============================================================

export function AdminCustomers() {
  const resource = useResource(bookingService);


  const customers = useMemo(() => {

    const map = {};

    resource.items.forEach((booking) => {

      const email = booking.email;

      if (!email) return;

      if (!map[email]) {

        map[email] = {
          id: email,
          name: booking.name,
          email,
          phone: booking.phone,
          count: 0,
        };

      }

      map[email].count += 1;

    });

    return Object.values(map);

  }, [resource.items]);


  return (
    <div className="dashboard-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">Administration</p>

          <h2>Customers</h2>

          <p className="muted">
            View customers generated from booking activity.
          </p>
        </div>

      </div>


      <ErrorState resource={resource} />


      {resource.loading ? (
        <Loading n={3} />
      ) : customers.length > 0 ? (

        <DataTable
          rows={customers}
          columns={[
            {
              key: 'name',
              label: 'Name',
            },
            {
              key: 'email',
              label: 'Email',
            },
            {
              key: 'phone',
              label: 'Phone',
            },
            {
              key: 'count',
              label: 'Bookings',
            },
          ]}
        />

      ) : (

        <div className="card empty">
          <h3>No customers found</h3>

          <p>
            Customers will appear after bookings are created.
          </p>
        </div>

      )}

    </div>
  );
}


// ============================================================
// ADMIN SETTINGS
// ============================================================

export function AdminSettings() {
  const { toast } = useApp();

  const [form, setForm] = useState({
    name: 'PHOTO STUDIO',
    email: 'hello@photostudio.demo',
    phone: '+91 98765 43210',
  });


  const updateField = (field, value) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };


  const saveSettings = (event) => {

    event.preventDefault();

    toast('Settings saved successfully');

  };


  return (
    <div className="dashboard-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">Administration</p>

          <h2>Studio Settings</h2>

          <p className="muted">
            Manage your photography studio information.
          </p>
        </div>

      </div>


      <form
        className="card pad form narrow0"
        onSubmit={saveSettings}
      >

        <Input
          label="Studio Name"
          value={form.name}
          onChange={(event) =>
            updateField(
              'name',
              event.target.value
            )
          }
        />


        <Input
          label="Contact Email"
          value={form.email}
          onChange={(event) =>
            updateField(
              'email',
              event.target.value
            )
          }
        />


        <Input
          label="Phone"
          value={form.phone}
          onChange={(event) =>
            updateField(
              'phone',
              event.target.value
            )
          }
        />


        <Button>
          Save Settings
        </Button>

      </form>

    </div>
  );
}