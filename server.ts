import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Supabase Client if credentials are provided
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

let supabase: SupabaseClient | null = null;
const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-service-role-key')
);

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase client initialized with provided credentials.');
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not found or placeholder. Running in local test memory mode.');
}

// In-memory orders storage (used when Supabase is not configured or for quick testing)
interface ServerOrder {
  id: string;
  orderId: string;
  createdAt: string;
  customerName: string;
  phoneNumber: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  deliveryZoneLabel: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      bengaliName: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
}

// Initial sample orders so the admin dashboard is immediately demonstrable and useful
const inMemoryOrders: ServerOrder[] = [
  {
    id: 'ord-101',
    orderId: 'NX-BD-89210',
    createdAt: 'Oct 25, 2026, 09:15 AM',
    customerName: 'Kazi Mahbub',
    phoneNumber: '01711223344',
    deliveryZone: 'inside_dhaka',
    deliveryZoneLabel: 'Inside Dhaka',
    deliveryAddress: 'Flat 4B, House 12, Road 7, Dhanmondi, Dhaka',
    deliveryNotes: 'Please deliver after 2:00 PM',
    items: [
      {
        product: {
          id: 'prod-2',
          name: "Men's Panjabi",
          bengaliName: "এক্সক্লুসিভ মেনস পাঞ্জাবি",
          price: 2250,
          image: '/src/assets/images/mens_panjabi_1792914499489.jpg',
          category: 'Traditional Fashion'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod-6',
          name: 'Pure Mustard Oil',
          bengaliName: 'খাঁটি ঘানি-ভাঙা সরিষার তেল',
          price: 360,
          image: '/src/assets/images/mustard_oil_pure_1792914501238.jpg',
          category: 'Pantry & Grocery'
        },
        quantity: 2
      }
    ],
    subtotal: 2970,
    deliveryCharge: 60,
    total: 3030,
    paymentMethod: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
    status: 'Confirmed',
    estimatedDelivery: '1-2 Days (24-48 Hours)'
  },
  {
    id: 'ord-102',
    orderId: 'NX-BD-91823',
    createdAt: 'Oct 25, 2026, 11:30 AM',
    customerName: 'Farhana Yasmin',
    phoneNumber: '01899887766',
    deliveryZone: 'outside_dhaka',
    deliveryZoneLabel: 'Outside Dhaka',
    deliveryAddress: 'Holding 84, Nasirabad Housing Society, Chittagong',
    deliveryNotes: 'Call receiver before delivery',
    items: [
      {
        product: {
          id: 'prod-4',
          name: 'Jamdani Saree',
          bengaliName: 'ঐতিহ্যবাহী জামদানি শাড়ি',
          price: 4800,
          image: '/src/assets/images/jamdani_saree_1792914500136.jpg',
          category: 'Traditional Fashion'
        },
        quantity: 1
      }
    ],
    subtotal: 4800,
    deliveryCharge: 120,
    total: 4920,
    paymentMethod: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
    status: 'Pending',
    estimatedDelivery: '2-4 Days (Courier Service)'
  }
];

// Admin Authentication Setup
// Default secure password for development/testing: nexora2026
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nexora2026';
const activeAdminTokens = new Set<string>();

// Helper to authenticate admin requests
const verifyAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token' });
  }

  next();
};

/* =========================================================================
   API ENDPOINTS
   ========================================================================= */

// 1. System status check (tells frontend whether Supabase is connected)
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    supabaseConfigured: isSupabaseConfigured,
    mode: isSupabaseConfigured ? 'supabase' : 'local_memory',
    adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD),
    message: isSupabaseConfigured
      ? 'Connected to persistent Supabase cloud database.'
      : 'Supabase credentials are not configured. Orders are running in local test memory mode.'
  });
});

// 2. Customer Order Submission (Cash on Delivery)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phoneNumber,
      deliveryAddress,
      deliveryZone,
      deliveryCharge,
      deliveryNotes,
      items,
      subtotal,
      total,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid customer name is required' });
    }

    if (!phoneNumber || typeof phoneNumber !== 'string' || !/^(\+?8801|01)[3-9]\d{8}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ error: 'Valid 11-digit Bangladeshi phone number is required' });
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
      return res.status(400).json({ error: 'Detailed delivery address is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items cannot be empty' });
    }

    const calculatedCharge = deliveryZone === 'outside_dhaka' ? 120 : 60;
    const finalDeliveryCharge = typeof deliveryCharge === 'number' ? deliveryCharge : calculatedCharge;
    const zoneLabel = deliveryZone === 'outside_dhaka' ? 'Outside Dhaka' : 'Inside Dhaka';
    const estimatedDelivery = deliveryZone === 'outside_dhaka' ? '2-4 Days (Courier Service)' : '1-2 Days (24-48 Hours)';

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NX-BD-${randomSuffix}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const newOrder: ServerOrder = {
      id: `ord-${Date.now()}-${randomSuffix}`,
      orderId,
      createdAt: formattedDate,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryZone: deliveryZone === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka',
      deliveryZoneLabel: zoneLabel,
      deliveryAddress: deliveryAddress.trim(),
      deliveryNotes: deliveryNotes ? deliveryNotes.trim() : undefined,
      items,
      subtotal: Number(subtotal),
      deliveryCharge: finalDeliveryCharge,
      total: Number(total),
      paymentMethod: paymentMethod || 'Cash on Delivery (ক্যাশ অন ডেলিভারি)',
      status: 'Pending',
      estimatedDelivery
    };

    // Attempt persistent save to Supabase if configured
    let persistedToSupabase = false;
    let supabaseError: string | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').insert([
          {
            id: newOrder.orderId,
            created_at: nowIso,
            customer_name: newOrder.customerName,
            phone_number: newOrder.phoneNumber,
            delivery_address: newOrder.deliveryAddress,
            delivery_zone: newOrder.deliveryZone,
            delivery_charge: newOrder.deliveryCharge,
            delivery_notes: newOrder.deliveryNotes || null,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            total: newOrder.total,
            payment_method: newOrder.paymentMethod,
            status: newOrder.status,
            estimated_delivery: newOrder.estimatedDelivery
          }
        ]);

        if (error) {
          console.error('Supabase insert error:', error);
          supabaseError = error.message;
        } else {
          persistedToSupabase = true;
          console.log(`✅ Order ${newOrder.orderId} successfully persisted to Supabase!`);
        }
      } catch (err: any) {
        console.error('Exception during Supabase insert:', err);
        supabaseError = err.message || 'Supabase query error';
      }
    }

    // Always keep in server memory as well for fast local retrieval
    inMemoryOrders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      order: newOrder,
      persistedToSupabase,
      supabaseConfigured: isSupabaseConfigured,
      supabaseError,
      message: persistedToSupabase
        ? 'Order placed and securely saved to Supabase cloud database.'
        : 'Order placed successfully. (Running in local test memory; Supabase not connected)'
    });
  } catch (error: any) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: error.message || 'Failed to place order' });
  }
});

// 3. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(token);

    // Expire token after 24 hours
    setTimeout(() => {
      activeAdminTokens.delete(token);
    }, 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      token,
      message: 'Admin authentication successful',
      expiresIn: '24h'
    });
  }

  return res.status(401).json({ error: 'Invalid admin password. Please try again.' });
});

// 4. Admin Logout
app.post('/api/admin/logout', verifyAdminAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (token) activeAdminTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// 5. Admin Fetch All Orders (Protected)
app.get('/api/admin/orders', verifyAdminAuth, async (req: Request, res: Response) => {
  try {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          // Normalize Supabase format to ServerOrder
          const mappedOrders: ServerOrder[] = data.map((row: any) => ({
            id: row.id,
            orderId: row.id,
            createdAt: new Date(row.created_at).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short'
            }),
            customerName: row.customer_name,
            phoneNumber: row.phone_number,
            deliveryZone: row.delivery_zone,
            deliveryZoneLabel: row.delivery_zone === 'outside_dhaka' ? 'Outside Dhaka' : 'Inside Dhaka',
            deliveryAddress: row.delivery_address,
            deliveryNotes: row.delivery_notes || undefined,
            items: row.items,
            subtotal: Number(row.subtotal),
            deliveryCharge: Number(row.delivery_charge),
            total: Number(row.total),
            paymentMethod: row.payment_method,
            status: row.status || 'Pending',
            estimatedDelivery: row.estimated_delivery
          }));

          return res.json({
            orders: mappedOrders,
            supabaseConfigured: true,
            storageMode: 'supabase'
          });
        }
        console.warn('Supabase fetch failed, falling back to server memory:', error?.message);
      } catch (err) {
        console.warn('Error reading from Supabase:', err);
      }
    }

    // Fallback to in-memory orders
    return res.json({
      orders: inMemoryOrders,
      supabaseConfigured: isSupabaseConfigured,
      storageMode: 'local_memory'
    });
  } catch (error: any) {
    console.error('Failed to retrieve orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// 6. Admin Update Order Status (Protected)
app.patch('/api/admin/orders/:id/status', verifyAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to update status in Supabase:', err);
      }
    }

    // Update in memory
    const existing = inMemoryOrders.find((o) => o.id === id || o.orderId === id);
    if (existing) {
      existing.status = status;
    }

    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// 7. Admin Delete Order (Protected)
app.delete('/api/admin/orders/:id', verifyAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete order from Supabase:', err);
      }
    }

    const index = inMemoryOrders.findIndex((o) => o.id === id || o.orderId === id);
    if (index !== -1) {
      inMemoryOrders.splice(index, 1);
    }

    res.json({ success: true, message: `Order ${id} deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete order' });
  }
});

/* =========================================================================
   VITE DEV MIDDLEWARE / STATIC ASSETS
   ========================================================================= */

async function startServer() {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (!process.env.NODE_ENV && fs.existsSync(path.resolve(__dirname, 'dist', 'index.html')));

  if (isProduction) {
    // Production build: serve pre-built static bundle
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback in development mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Nexora Shop server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
