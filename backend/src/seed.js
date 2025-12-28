import { connectDB, disconnectDB } from './config/database.js';
import { Material } from './models/Material.js';
import { StockMovement } from './models/StockMovement.js';

/**
 * DATABASE SEED FILE - BASIC INVENTORY SYSTEM
 * 
 * This seed file populates the database with comprehensive test data
 * covering all core scenarios for the basic inventory system:
 * 
 * COVERAGE:
 * - Multiple categories (Tiles, Laminates, Lighting, Sanitaryware, Paints, Hardware)
 * - Zero stock products (for testing "add stock" functionality)
 * - Low stock products (below reorder level)
 * - Normal stock products
 * - High stock products
 * - Edge cases (long names, special characters in SKU)
 * - Stock movement history (INWARD/OUTWARD transactions)
 * 
 * USAGE:
 *   npm run seed
 * 
 * IDEMPOTENCY:
 *   - Clears all existing data before seeding
 *   - Safe to re-run multiple times
 */

async function main() {
  console.log('🌱 Seeding database with comprehensive test data...\n');

  // Connect to MongoDB
  await connectDB();

  // Clear existing data (ensures idempotency)
  console.log('🗑️  Clearing existing data...');
  await StockMovement.deleteMany({});
  await Material.deleteMany({});
  console.log('✅ Database cleared\n');

  console.log('📦 Creating materials...');

  // Create materials covering all scenarios
  const materials = await Material.insertMany([
    // ============================================================
    // CATEGORY: Tiles - Multiple products with varying stock levels
    // ============================================================
    {
      sku: 'TILE-001',
      name: 'Ceramic Floor Tile 60x60',
      category: 'Tiles',
      supplier: 'Supreme Ceramics',
      unitPrice: 450,
      availableQuantity: 150,
      damagedQuantity: 5,
      reorderLevel: 50,
    },
    {
      sku: 'TILE-002',
      name: 'Porcelain Wall Tile 30x60',
      category: 'Tiles',
      supplier: 'Nitco Ltd',
      unitPrice: 380,
      availableQuantity: 200,
      damagedQuantity: 0,
      reorderLevel: 75,
    },
    {
      sku: 'TILE-003',
      name: 'Vitrified Tile Premium Glossy Finish',
      category: 'Tiles',
      supplier: 'Kajaria Ceramics',
      unitPrice: 520,
      availableQuantity: 5, // LOW STOCK - below reorder level
      damagedQuantity: 0,
      reorderLevel: 30,
    },
    {
      sku: 'TILE-004',
      name: 'Mosaic Tile Pattern Blue & White Designer Collection',
      category: 'Tiles',
      supplier: 'Somany Ceramics',
      unitPrice: 680,
      availableQuantity: 0, // ZERO STOCK - test add stock functionality
      damagedQuantity: 2,
      reorderLevel: 20,
    },

    // ============================================================
    // CATEGORY: Laminates
    // ============================================================
    {
      sku: 'LAM-001',
      name: 'Premium HPL Laminate Sheets',
      category: 'Laminates',
      supplier: 'Sunmica India',
      unitPrice: 850,
      availableQuantity: 80,
      damagedQuantity: 2,
      reorderLevel: 30,
    },
    {
      sku: 'LAM-002',
      name: 'Eco-Friendly Laminate',
      category: 'Laminates',
      supplier: 'Formica Group',
      unitPrice: 920,
      availableQuantity: 120,
      damagedQuantity: 0,
      reorderLevel: 40,
    },
    {
      sku: 'LAM-003',
      name: 'Textured Wood Grain Laminate',
      category: 'Laminates',
      supplier: 'Merino Laminates',
      unitPrice: 780,
      availableQuantity: 0, // ZERO STOCK
      damagedQuantity: 0,
      reorderLevel: 25,
    },

    // ============================================================
    // CATEGORY: Lighting
    // ============================================================
    {
      sku: 'LIGHT-001',
      name: 'LED Panel Light 36W',
      category: 'Lighting',
      supplier: 'Philips India',
      unitPrice: 1200,
      availableQuantity: 45,
      damagedQuantity: 1,
      reorderLevel: 20,
    },
    {
      sku: 'LIGHT-002',
      name: 'Fluorescent Tube 40W',
      category: 'Lighting',
      supplier: 'Osram Limited',
      unitPrice: 280,
      availableQuantity: 8, // LOW STOCK
      damagedQuantity: 0,
      reorderLevel: 40,
    },
    {
      sku: 'LIGHT-003',
      name: 'Smart LED Bulb WiFi Enabled RGB',
      category: 'Lighting',
      supplier: 'Syska LED',
      unitPrice: 850,
      availableQuantity: 500, // HIGH STOCK
      damagedQuantity: 0,
      reorderLevel: 50,
    },

    // ============================================================
    // CATEGORY: Sanitaryware
    // ============================================================
    {
      sku: 'SANIT-001',
      name: 'Ceramic Water Closet',
      category: 'Sanitaryware',
      supplier: 'Kohler India',
      unitPrice: 4500,
      availableQuantity: 25,
      damagedQuantity: 1,
      reorderLevel: 10,
    },
    {
      sku: 'SANIT-002',
      name: 'Wall-Mounted Wash Basin',
      category: 'Sanitaryware',
      supplier: 'Jaquar Group',
      unitPrice: 3200,
      availableQuantity: 35,
      damagedQuantity: 0,
      reorderLevel: 15,
    },
    {
      sku: 'SANIT-003',
      name: 'Premium Stainless Steel Kitchen Sink Double Bowl',
      category: 'Sanitaryware',
      supplier: 'Cera Sanitaryware',
      unitPrice: 5600,
      availableQuantity: 0, // ZERO STOCK
      damagedQuantity: 0,
      reorderLevel: 8,
    },

    // ============================================================
    // CATEGORY: Paints
    // ============================================================
    {
      sku: 'PAINT-001',
      name: 'Premium Exterior Paint (20L)',
      category: 'Paints',
      supplier: 'Asian Paints',
      unitPrice: 2400,
      availableQuantity: 60,
      damagedQuantity: 3,
      reorderLevel: 25,
    },
    {
      sku: 'PAINT-002',
      name: 'Interior Emulsion (10L)',
      category: 'Paints',
      supplier: 'Berger Paints',
      unitPrice: 1400,
      availableQuantity: 3, // LOW STOCK
      damagedQuantity: 0,
      reorderLevel: 20,
    },
    {
      sku: 'PAINT-003',
      name: 'Waterproofing Sealant Coat',
      category: 'Paints',
      supplier: 'Dulux Paints',
      unitPrice: 1800,
      availableQuantity: 95,
      damagedQuantity: 1,
      reorderLevel: 30,
    },

    // ============================================================
    // CATEGORY: Hardware - New category for testing
    // ============================================================
    {
      sku: 'HW-001',
      name: 'Door Handle Brass Antique Finish',
      category: 'Hardware',
      supplier: 'Yale India',
      unitPrice: 450,
      availableQuantity: 120,
      damagedQuantity: 0,
      reorderLevel: 40,
    },
    {
      sku: 'HW-002',
      name: 'Door Lock Digital Smart Biometric',
      category: 'Hardware',
      supplier: 'Godrej Security',
      unitPrice: 8500,
      availableQuantity: 0, // ZERO STOCK
      damagedQuantity: 0,
      reorderLevel: 5,
    },
    {
      sku: 'HW-003',
      name: 'Window Hinge Stainless Steel 304 Grade Premium Quality',
      category: 'Hardware',
      supplier: 'Dorma India',
      unitPrice: 280,
      availableQuantity: 2, // VERY LOW STOCK
      damagedQuantity: 0,
      reorderLevel: 50,
    },

    // ============================================================
    // EDGE CASES - Testing special scenarios
    // ============================================================
    {
      sku: 'SPEC-001',
      name: 'Special Product with Very Long Name for Testing UI Display and Truncation Behavior in Tables',
      category: 'Other',
      supplier: 'Test Supplier',
      unitPrice: 1000,
      availableQuantity: 15,
      damagedQuantity: 0,
      reorderLevel: 10,
    },
    {
      sku: 'TEST-999',
      name: 'Test Product Zero Stock',
      category: 'Other',
      supplier: 'Test Supplier',
      unitPrice: 100,
      availableQuantity: 0, // ZERO STOCK for testing
      damagedQuantity: 0,
      reorderLevel: 5,
    },
  ]);

  console.log(`✅ Created ${materials.length} materials\n`);

  console.log('📊 Creating stock movements (transaction history)...');

  // Create stock movements with realistic transaction history
  const now = new Date();
  const movements = [
    // ============================================================
    // TILE-001 - Active product with multiple transactions
    // ============================================================
    {
      materialId: materials[0]._id,
      type: 'INWARD',
      quantity: 200,
      reason: 'Purchase',
      reference: 'PO-2025-001',
      notes: 'Initial stock purchase',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      materialId: materials[0]._id,
      type: 'OUTWARD',
      quantity: 50,
      reason: 'Sales',
      reference: 'INV-2025-001',
      notes: 'Sold to retail customer',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
      materialId: materials[0]._id,
      type: 'OUTWARD',
      quantity: 5,
      reason: 'Damage',
      notes: 'Damaged during handling',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
    {
      materialId: materials[0]._id,
      type: 'OUTWARD',
      quantity: 30,
      reason: 'Sales',
      reference: 'INV-2025-015',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      materialId: materials[0]._id,
      type: 'INWARD',
      quantity: 35,
      reason: 'Purchase',
      reference: 'PO-2025-012',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },

    // ============================================================
    // TILE-002 - Normal product with steady movement
    // ============================================================
    {
      materialId: materials[1]._id,
      type: 'INWARD',
      quantity: 250,
      reason: 'Purchase',
      reference: 'PO-2025-002',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[1]._id,
      type: 'OUTWARD',
      quantity: 50,
      reason: 'Sales',
      reference: 'INV-2025-002',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // TILE-003 - Low stock product (needs reordering)
    // ============================================================
    {
      materialId: materials[2]._id,
      type: 'INWARD',
      quantity: 50,
      reason: 'Purchase',
      reference: 'PO-2025-003',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[2]._id,
      type: 'OUTWARD',
      quantity: 45,
      reason: 'Sales',
      reference: 'INV-2025-008',
      notes: 'Large order - stock running low',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // TILE-004 - Zero stock (all sold out)
    // ============================================================
    {
      materialId: materials[3]._id,
      type: 'INWARD',
      quantity: 30,
      reason: 'Purchase',
      reference: 'PO-2025-004',
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[3]._id,
      type: 'OUTWARD',
      quantity: 28,
      reason: 'Sales',
      reference: 'INV-2025-010',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[3]._id,
      type: 'OUTWARD',
      quantity: 2,
      reason: 'Damage',
      notes: 'Damaged tiles during transport',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // LAM-001 - Laminate with recent activity
    // ============================================================
    {
      materialId: materials[4]._id,
      type: 'INWARD',
      quantity: 100,
      reason: 'Purchase',
      reference: 'PO-2025-005',
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[4]._id,
      type: 'OUTWARD',
      quantity: 20,
      reason: 'Sales',
      reference: 'INV-2025-005',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[4]._id,
      type: 'OUTWARD',
      quantity: 2,
      reason: 'Damage',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // LAM-002 - Popular product with high turnover
    // ============================================================
    {
      materialId: materials[5]._id,
      type: 'INWARD',
      quantity: 150,
      reason: 'Purchase',
      reference: 'PO-2025-006',
      createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[5]._id,
      type: 'OUTWARD',
      quantity: 30,
      reason: 'Sales',
      reference: 'INV-2025-006',
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // LAM-003 - Zero stock, no recent activity
    // ============================================================
    {
      materialId: materials[6]._id,
      type: 'INWARD',
      quantity: 40,
      reason: 'Purchase',
      reference: 'PO-2025-007',
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // Old purchase
    },
    {
      materialId: materials[6]._id,
      type: 'OUTWARD',
      quantity: 40,
      reason: 'Sales',
      reference: 'INV-2025-011',
      createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000), // Sold out long ago
    },

    // ============================================================
    // LIGHT-001 - LED lights with consistent sales
    // ============================================================
    {
      materialId: materials[7]._id,
      type: 'INWARD',
      quantity: 60,
      reason: 'Purchase',
      reference: 'PO-2025-008',
      createdAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[7]._id,
      type: 'OUTWARD',
      quantity: 15,
      reason: 'Sales',
      reference: 'INV-2025-012',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[7]._id,
      type: 'OUTWARD',
      quantity: 1,
      reason: 'Damage',
      notes: 'Defective unit',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // LIGHT-002 - Low stock, inactive (dead stock scenario)
    // ============================================================
    {
      materialId: materials[8]._id,
      type: 'INWARD',
      quantity: 50,
      reason: 'Purchase',
      reference: 'PO-2025-009',
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    },
    {
      materialId: materials[8]._id,
      type: 'OUTWARD',
      quantity: 42,
      reason: 'Sales',
      reference: 'INV-2025-013',
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000), // 50 days ago - no recent activity
    },

    // ============================================================
    // LIGHT-003 - High stock, popular item
    // ============================================================
    {
      materialId: materials[9]._id,
      type: 'INWARD',
      quantity: 600,
      reason: 'Purchase',
      reference: 'PO-2025-010',
      notes: 'Bulk order for new product launch',
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[9]._id,
      type: 'OUTWARD',
      quantity: 100,
      reason: 'Sales',
      reference: 'INV-2025-014',
      notes: 'High demand item',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // SANIT-001 - Sanitaryware with moderate activity
    // ============================================================
    {
      materialId: materials[10]._id,
      type: 'INWARD',
      quantity: 30,
      reason: 'Purchase',
      reference: 'PO-2025-011',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[10]._id,
      type: 'OUTWARD',
      quantity: 5,
      reason: 'Sales',
      reference: 'INV-2025-016',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[10]._id,
      type: 'OUTWARD',
      quantity: 1,
      reason: 'Damage',
      notes: 'Broken during installation demo',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // PAINT-001 - Paint with multiple small transactions
    // ============================================================
    {
      materialId: materials[13]._id,
      type: 'INWARD',
      quantity: 80,
      reason: 'Purchase',
      reference: 'PO-2025-013',
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[13]._id,
      type: 'OUTWARD',
      quantity: 10,
      reason: 'Sales',
      reference: 'INV-2025-017',
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[13]._id,
      type: 'OUTWARD',
      quantity: 3,
      reason: 'Damage',
      notes: 'Leaked cans',
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[13]._id,
      type: 'OUTWARD',
      quantity: 7,
      reason: 'Sales',
      reference: 'INV-2025-018',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // PAINT-002 - Low stock paint
    // ============================================================
    {
      materialId: materials[14]._id,
      type: 'INWARD',
      quantity: 25,
      reason: 'Purchase',
      reference: 'PO-2025-014',
      createdAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[14]._id,
      type: 'OUTWARD',
      quantity: 22,
      reason: 'Sales',
      reference: 'INV-2025-019',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // HW-001 - Hardware with steady demand
    // ============================================================
    {
      materialId: materials[16]._id,
      type: 'INWARD',
      quantity: 150,
      reason: 'Purchase',
      reference: 'PO-2025-015',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[16]._id,
      type: 'OUTWARD',
      quantity: 30,
      reason: 'Sales',
      reference: 'INV-2025-020',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },

    // ============================================================
    // HW-003 - Very low stock hardware
    // ============================================================
    {
      materialId: materials[18]._id,
      type: 'INWARD',
      quantity: 60,
      reason: 'Purchase',
      reference: 'PO-2025-016',
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
    },
    {
      materialId: materials[18]._id,
      type: 'OUTWARD',
      quantity: 58,
      reason: 'Sales',
      reference: 'INV-2025-021',
      notes: 'Popular item - need urgent reorder',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
  ];

  await StockMovement.insertMany(movements);

  console.log(`✅ Created ${movements.length} stock movements\n`);

  // Print summary statistics
  console.log('📈 SEED DATA SUMMARY:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📦 Total Materials: ${materials.length}`);
  console.log(`📊 Total Stock Movements: ${movements.length}`);
  console.log('');
  
  // Count by category
  const categories = [...new Set(materials.map(m => m.category))];
  console.log(`📂 Categories: ${categories.length}`);
  categories.forEach(cat => {
    const count = materials.filter(m => m.category === cat).length;
    console.log(`   - ${cat}: ${count} products`);
  });
  console.log('');

  // Count stock scenarios
  const zeroStock = materials.filter(m => m.availableQuantity === 0).length;
  const lowStock = materials.filter(m => m.availableQuantity > 0 && m.availableQuantity <= m.reorderLevel).length;
  const normalStock = materials.filter(m => m.availableQuantity > m.reorderLevel).length;
  
  console.log('📊 Stock Scenarios:');
  console.log(`   - Zero Stock: ${zeroStock} products (for testing "add stock")`);
  console.log(`   - Low Stock: ${lowStock} products (below reorder level)`);
  console.log(`   - Normal Stock: ${normalStock} products`);
  console.log('');

  console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('🚀 You can now test:');
  console.log('   ✓ Add new products (try SKU: NEW-001)');
  console.log('   ✓ Update stock for zero-stock products (TILE-004, LAM-003, etc.)');
  console.log('   ✓ View inventory with filters and search');
  console.log('   ✓ Low stock alerts (TILE-003, LIGHT-002, PAINT-002, HW-003)');
  console.log('   ✓ Stock movement history for all products');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDB();
  });
