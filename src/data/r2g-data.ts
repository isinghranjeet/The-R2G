import { Activity, Cuboid, Layers3, Printer } from "lucide-react";

export const courses = [
  { title: "SolidWorks Masterclass", label: "MECHANICAL DESIGN", copy: "Build production-ready parts, assemblies and drawings through practical project work.", duration: "12 weeks", tags: ["SolidWorks", "Assemblies", "Simulation"], icon: Cuboid, seats: 3 },
  { title: "AutoCAD 2D & 3D", label: "DESIGN & DRAFTING", copy: "Create accurate engineering drawings and move confidently into 3D modeling.", duration: "8 weeks", tags: ["AutoCAD", "Drafting", "3D modeling"], icon: Layers3, seats: 4 },
  { title: "Siemens NX & CAM", label: "ADVANCED MANUFACTURING", copy: "Connect product design with toolpaths and practical manufacturing workflows.", duration: "12 weeks", tags: ["Siemens NX", "CAM", "CNC"], icon: Activity, seats: 2 },
  { title: "3D Printing & Prototyping", label: "ADDITIVE MANUFACTURING", copy: "Take a design from your CAD model to a physical, tested prototype.", duration: "6 weeks", tags: ["FDM", "Slicing", "Prototyping"], icon: Printer, seats: 1 },
];

export const verifiedCertificates: Record<string, { name: string; course: string; year: string }> = {
  "R2G-2026-CAD-8941": { name: "Ranjeet Kumar", course: "Industrial CAD/CAM & 3D Prototyping", year: "March 2026" },
  "R2G-2025-1048": { name: "Aarav Mehta", course: "SolidWorks Masterclass", year: "2025" },
  "R2G-2025-2091": { name: "Priya Sharma", course: "AutoCAD 2D & 3D", year: "2025" },
};

export const curriculum = [
  ["01", "Parametric sketching", "Constraints, geometric intent, datum planes and fully defined 2D sketches.", "Sketch a dimension-driven mounting bracket."],
  ["02", "Engineering drawing standards", "Orthographic views, section lines, tolerances, GD&T and drawing annotations.", "Produce a dimensioned component drawing."],
  ["03", "Design for manufacture", "Design intent, material selection, design reviews and a first portfolio milestone.", "Submit a review-ready CAD design pack."],
  ["04", "Solid part modeling", "Extrudes, revolves, swept features, patterns, shelling and parametric feature trees.", "Build an editable gearbox housing."],
  ["05", "Advanced 3D features", "Complex sketches, ribs, draft angles, multi-body parts and design tables.", "Model a manufacturable impeller."],
  ["06", "Surface modeling", "Boundary surfaces, lofts, curvature continuity and hybrid solid workflows.", "Create a Class-A styled product shell."],
  ["07", "Assembly & motion", "Assembly mates, design layouts, motion relationships and interference checks.", "Assemble and animate a mini gearbox."],
  ["08", "Sheet-metal design", "Bends, flanges, flat patterns, allowances and fabrication-ready drawings.", "Design and unfold an instrument enclosure."],
  ["09", "Tooling & mold design", "Parting directions, draft checks, mold concepts and tooling fundamentals.", "Create a tooling-ready molded component."],
  ["10", "FEA fundamentals", "Mesh preparation, boundary conditions, load cases and stress interpretation.", "Compare stress and displacement results."],
  ["11", "Design optimization", "Validate, refine and prepare engineering files for additive manufacture.", "Prepare a print-ready prototype package."],
  ["12", "Capstone & 3D prototyping", "Present an integrated project, prototype and portfolio-ready technical report.", "Present a finished industrial design project."],
];

export const projects = [
  { title: "Electric drive housing", category: "Automotive", student: "Arjun Mehta", software: "SolidWorks · ANSYS", company: "Maruti Suzuki", quote: "I could finally explain my design decisions with a complete, tested model." },
  { title: "Turbine blade study", category: "Aerospace", student: "Neha Sharma", software: "CATIA · Siemens NX", company: "L&T Technology Services", quote: "The portfolio project gave me a strong conversation starter at interviews." },
  { title: "Desktop filament winder", category: "3D Prototype Lab", student: "Karan Singh", software: "Creo · 3D Printing", company: "Uno Minda", quote: "Building the physical prototype helped me understand the entire product lifecycle." },
  { title: "Sheet-metal enclosure", category: "Sheet Metal", student: "Priya Verma", software: "SolidWorks · AutoCAD", company: "Havells", quote: "I learned to take a careful drawing all the way to a production-ready design." },
];

export const alumni = [
  { name: "Vikram Yadav", role: "Junior BIW Design Engineer", company: "Maruti Suzuki", package: "4.8 LPA", year: "2025" },
  { name: "Anjali Rawat", role: "Mechanical CAD Designer", company: "Tata Motors", package: "5.2 LPA", year: "2025" },
  { name: "Rohit Kumar", role: "Product Design Associate", company: "L&T", package: "4.5 LPA", year: "2024" },
  { name: "Pooja Saini", role: "Design Engineer", company: "Havells", package: "4.2 LPA", year: "2025" },
  { name: "Deepak Chauhan", role: "Tool Design Trainee", company: "Uno Minda", package: "3.8 LPA", year: "2024" },
];

export const domains = ["Mechanical", "Civil / Architecture", "Electrical", "Tool & Die"];
export const softwareChoices = ["SolidWorks", "AutoCAD", "CATIA", "Siemens NX", "ANSYS FEA", "3D Printing"];
export const materials = ["PLA", "ABS", "PETG", "Carbon Fiber", "Tough Resin"];