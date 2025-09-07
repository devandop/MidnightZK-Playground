# Midnight Networks IDE - Zero-Knowledge Circuit Playground

A comprehensive web-based IDE for designing, visualizing, and testing zero-knowledge proof circuits using Midnight Networks and Midnight Compact Language. This interactive playground helps developers understand confidential computing, private data protection, and the building blocks of ZK proofs.


## 🌟 Features

### Interactive Circuit Designer
- **Drag-and-drop interface** using ReactFlow for creating ZK circuits
- **Real-time visualization** of circuit topology and data flow
- **Animated proof generation** showing data movement through circuit nodes
- **Private input emphasis** with visual indicators for confidential data

### Demo Scenarios
1. **Confidential Voting** - Demonstrate private voter credentials while proving eligibility
2. **Sealed Bid Auction** - Show how bid amounts remain secret until reveal phase
3. **Anonymous Identity Verification** - Prove age/eligibility without revealing personal data

### Privacy & Security Features
- **Private input protection** - Sensitive data is visually encrypted (password fields)
- **Double voting prevention** - Nullifier constraints prevent duplicate submissions
- **Zero-knowledge proofs** - Verify claims without revealing underlying data
- **Midnight Compact Language** examples for each scenario

### Educational Content
- **Step-by-step proof generation** with detailed explanations
- **Privacy benefits** clearly explained for each use case
- **Midnight Networks documentation** integration
- **Dark/light theme support** for better user experience

## Screenshots
![ZK Playground ](screenshots/midnight-ss-1.PNG)

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- PostgreSQL database (automatically provided on Replit)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd midnight-networks-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup (if running locally)**
   ```bash
   # Create PostgreSQL database and set DATABASE_URL environment variable
   export DATABASE_URL="postgresql://username:password@localhost:5432/midnight_ide"
   
   # Push database schema
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🚀 Deployment

### Replit Deployment (Recommended)

1. **Fork on Replit**
   - Go to [Replit](https://replit.com) and fork this project
   - Dependencies will be automatically installed

2. **Database Setup**
   - PostgreSQL database is automatically provisioned
   - Environment variables are set automatically

3. **Deploy with Autoscale**
   - Click the "Deploy" button in your Replit workspace
   - Choose "Autoscale" deployment type
   - Configure build settings:
     ```json
     {
       "build": "npm run build",
       "run": "npm start"
     }
     ```
   - Click "Deploy" to go live

4. **Custom Domain (Optional)**
   - Add your custom domain in the deployment settings
   - SSL certificates are automatically managed

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="your-postgresql-connection-string"
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t midnight-ide .
   docker run -p 5000:5000 -e DATABASE_URL="your-db-url" midnight-ide
   ```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Vite** as the build tool and development server
- **ReactFlow** for interactive circuit visualization
- **Radix UI + shadcn/ui** for consistent, accessible components
- **Tailwind CSS** for styling with dark/light theme support
- **TanStack Query** for state management and data fetching

### Backend Stack
- **Express.js** with TypeScript for RESTful API
- **PostgreSQL** with Drizzle ORM for data persistence
- **Session management** with connect-pg-simple
- **Hot-reload development** with seamless full-stack integration

### Key Components

#### Circuit Designer (`CircuitDesigner.tsx`)
```typescript
// Interactive circuit visualization with ReactFlow
const CircuitDesigner: React.FC<CircuitDesignerProps> = ({
  nodes, edges, animatedNodes, animatedEdges
}) => {
  // Handles drag-and-drop, connections, and animations
  return (
    <ReactFlow
      nodes={processedNodes}
      edges={processedEdges}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};
```

#### Proof Generation Hook (`useProofGeneration.ts`)
```typescript
// Manages ZK proof simulation with circuit animations
export const useProofGeneration = () => {
  const [status, setStatus] = useState<ProofStatus>('idle');
  const [animatedNodes, setAnimatedNodes] = useState<string[]>([]);
  const [animatedEdges, setAnimatedEdges] = useState<string[]>([]);

  const generateProof = async (scenario: string, inputs: Record<string, string>) => {
    // Simulate proof generation with step-by-step visualization
    // Animate circuit nodes and edges to show data flow
    // Check for double voting and other constraints
  };

  return { status, animatedNodes, animatedEdges, generateProof };
};
```

#### Scenario Data (`scenarios.ts`)
```typescript
// Demo scenarios with circuit definitions and Midnight Compact code
export const scenarios: Scenario[] = [
  {
    id: 'voting',
    name: 'Confidential Voting',
    circuit: {
      nodes: [
        {
          id: 'input-1',
          data: {
            label: 'Private Voter Input',
            isPrivate: true,
            color: '#EF4444'
          }
        }
        // ... more nodes
      ]
    },
    inputs: [
      { label: 'Private Credentials', key: 'private_credentials', isPrivate: true },
      { label: 'Secret Nullifier', key: 'secret_nullifier', isPrivate: true }
    ],
    code: `// Midnight Compact Language Example
circuit ConfidentialVote {
  private input voter_id: Field;
  private input choice: Field;
  private input nullifier_secret: Field;
  
  public input nullifier_hash: Field;
  public output commitment: Field;
  
  // Privacy-preserving computations
  let vote_hash = hash(voter_id, choice);
  let nullifier = hash(voter_id, nullifier_secret);
  assert(nullifier == nullifier_hash);
  
  commitment = hash(vote_hash, nullifier);
}`
  }
];
```

## 🔐 Privacy Features

### Private Input Handling
The IDE demonstrates true zero-knowledge privacy by:

1. **Visual Encryption** - Private inputs use password fields and red styling
2. **Lock Icons** - Clear indicators show which data remains confidential
3. **Explanatory Text** - Users understand what "private" means in ZK context
4. **Separate Public/Private** - Clear distinction between revealed and hidden data

### Example: Age Verification
```typescript
// User wants to prove they're over 18 without revealing exact age
inputs: [
  { label: 'Private Age', key: 'age', type: 'number', defaultValue: '25', isPrivate: true },
  { label: 'Private SSN', key: 'private_ssn', type: 'text', defaultValue: '***-**-5678', isPrivate: true }
]

// Circuit proves age >= 18 without revealing actual age
circuit AnonymousIdentity {
  private input age: Field;
  private input identity_hash: Field;
  
  // Verify age requirement without revealing age
  assert(age >= 18);
  
  // Generate anonymous token proving eligibility
  anonymous_token = hash(identity_hash, age);
}
```

## 🎯 Use Cases

### 1. Confidential Voting
- **Private**: Voter ID, credentials, nullifier secret
- **Public**: Vote commitment, nullifier hash
- **Privacy Benefit**: Vote choice remains secret while preventing double voting

### 2. Sealed Bid Auction
- **Private**: Bid amount, bidder identity, random nonce
- **Public**: Minimum bid requirement, commitment
- **Privacy Benefit**: Bid amounts hidden until reveal phase

### 3. Anonymous Identity Verification
- **Private**: Age, SSN, birth certificate hash
- **Public**: Identity type, verification result
- **Privacy Benefit**: Prove eligibility without revealing personal details

## 🛠️ Development

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui component library
│   │   │   ├── CircuitDesigner.tsx
│   │   │   ├── ProofGenerator.tsx
│   │   │   ├── ScenarioSidebar.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── data/
│   │   │   └── scenarios.ts    # Demo scenario definitions
│   │   ├── hooks/
│   │   │   └── useProofGeneration.ts
│   │   ├── pages/
│   │   │   └── IDE.tsx         # Main IDE interface
│   │   ├── types/
│   │   │   └── circuit.ts      # TypeScript type definitions
│   │   └── App.tsx
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite development server integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema with Drizzle ORM
└── package.json
```

### Key Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build
```

## 🎨 Theming

The application supports both light and dark themes with comprehensive color schemes:

```css
:root {
  --primary: hsl(217 91% 60%);        /* Midnight Blue */
  --accent: hsl(262 83% 58%);         /* Purple accent */
  --destructive: hsl(356 90% 54%);    /* Red for private data */
  --background: hsl(0 0% 100%);       /* Light background */
}

.dark {
  --background: hsl(222 84% 9%);      /* Dark background */
  --foreground: hsl(210 40% 98%);     /* Light text */
}
```

## 📚 Educational Value

### Learning Objectives
1. **Zero-Knowledge Concepts** - Understand how to prove statements without revealing data
2. **Circuit Design** - Learn how ZK circuits process private and public inputs
3. **Midnight Networks** - Explore the platform's capabilities for confidential computing
4. **Privacy Engineering** - See practical applications of privacy-preserving technologies

### Interactive Elements
- **Step-by-step proof generation** with visual feedback
- **Circuit animation** showing data flow during computation
- **Real-time code examples** in Midnight Compact Language
- **Privacy explanations** for each scenario

## 🔗 External Resources

- [Midnight Networks Documentation](https://docs.midnight.network/)
- [Zero-Knowledge Proofs Explained](https://docs.midnight.network/learn/zk-proofs)
- [Midnight Compact Language Guide](https://docs.midnight.network/compact)
- [Privacy-Preserving Smart Contracts](https://docs.midnight.network/contracts)

## Video 
https://www.loom.com/share/d81f0fbf67d345fa981e56348bbedca5?sid=4c475bdb-9c6e-4a4f-924b-fb65360e82ee

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **Midnight Networks** for the innovative privacy platform
- **ReactFlow** for the excellent graph visualization library
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Replit** for the development platform

---

**Built with ❤️ for the privacy-preserving future of computing**
