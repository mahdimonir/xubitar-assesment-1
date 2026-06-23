import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.preorder.deleteMany({});

  const products = [
    "NovaSound Wireless Headphones",
    "ApexFit Smartwatch v4",
    "AeroGlide Wireless Mouse",
    "HyperCharge Powerbank 20K",
    "TerraGuard Travel Backpack",
    "Eclipse Mechanical Keyboard",
    "FocusLens 4K Ultra Webcam",
    "VoltStream Multi-port Charger",
    "QuantumLink WiFi 6 Router",
    "OmniDesk Height Adjustable Desk",
    "LuminaRGB LED Strip Lights",
    "SoundWave Portable Bluetooth Speaker",
    "ClearView Monitor Mount",
    "SecureKey Hardware Wallet",
    "TitanShield Tempered Glass",
    "AirPure Desktop Humidifier",
    "ZenPad Ergonomic Wrist Rest",
    "CoreCompute Mini PC",
    "Polaris Liquid CPU Cooler",
    "VeloRoute Bike Phone Mount",
    "FlexGrip Resistance Band Set",
    "BreezeWave Tower Fan",
    "SyncDock Dual USB-C Hub",
    "VisionPro Anti-Blue Light Glasses",
    "SteadyShot Smartphone Gimbal",
    "SolarVolt Portable Solar Panel",
    "RetroPlay Handheld Console",
    "ThermalGuard Smart Thermostat",
    "HydroSip Insulated Water Bottle",
    "NestNest Wireless Security Camera",
    "PocketDraft Digital Notebook",
    "GlowWand Ring Light 10 Inch",
    "AeroCook Air Fryer XL",
    "SleepTight Memory Foam Pillow",
    "SoundBarrier Acoustic Panels",
    "SwiftPrint Label Maker",
    "OrbitTrack Bluetooth Tracker",
    "ChefMaster Precision Sous Vide",
    "GuardDog Smart Door Lock",
    "NanoDrive 2TB External SSD",
    "SpineCare Office Chair Cushion",
    "GigaCharge Magnetic Cable",
    "PureStream Water Filter Pitcher",
    "BioGrow Smart Indoor Garden",
    "EchoLink Smart Speaker Stand"
  ];

  const preorders = products.map((name, index) => {
    const productsCount = Math.floor(Math.random() * 10) + 1;
    const preorderWhen = index % 3 === 0 ? "out-of-stock" : "regardless-of-stock";
    
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() - (index - 20));
    
    let endsAt = null;
    if (index % 4 === 0) {
      endsAt = new Date(startsAt);
      endsAt.setDate(endsAt.getDate() + 5);
    }
    
    const active = index % 5 !== 0;

    return {
      name,
      products: productsCount,
      preorderWhen,
      startsAt,
      endsAt,
      active
    };
  });

  for (const preorder of preorders) {
    await prisma.preorder.create({
      data: preorder
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
