import { Scenario } from '../types/circuit';

export const scenarios: Scenario[] = [
  {
    id: 'voting',
    name: 'Confidential Voting',
    description: 'Zero-knowledge ballot verification',
    icon: 'fas fa-vote-yea',
    circuit: {
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Private Voter Input',
            icon: 'fas fa-user-secret',
            description: 'ID + Choice (Hidden)',
            color: '#EF4444',
            isPrivate: true
          }
        },
        {
          id: 'hash-1',
          type: 'hash',
          position: { x: 350, y: 100 },
          data: {
            label: 'Hash Function',
            icon: 'fas fa-hashtag',
            description: 'SHA-256',
            color: '#8B5CF6'
          }
        },
        {
          id: 'nullifier-1',
          type: 'nullifier',
          position: { x: 200, y: 250 },
          data: {
            label: 'Nullifier Check',
            icon: 'fas fa-ban',
            description: 'Prevent Double Voting',
            color: '#EF4444'
          }
        },
        {
          id: 'verify-1',
          type: 'verify',
          position: { x: 450, y: 250 },
          data: {
            label: 'ZK Verify',
            icon: 'fas fa-check-circle',
            description: 'Proof Validation',
            color: '#10B981'
          }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'hash-1', animated: true },
        { id: 'e1-3', source: 'input-1', target: 'nullifier-1', animated: true },
        { id: 'e2-4', source: 'hash-1', target: 'verify-1', animated: true },
        { id: 'e3-4', source: 'nullifier-1', target: 'verify-1', animated: true }
      ]
    },
    proofSteps: [
      { id: '1', text: 'Initializing voting circuit parameters', icon: 'fas fa-cog', status: 'pending', delay: 500 },
      { id: '2', text: 'Hashing private voter credentials', icon: 'fas fa-hashtag', status: 'pending', delay: 1000 },
      { id: '3', text: 'Generating unique nullifier from voter ID + credentials', icon: 'fas fa-ban', status: 'pending', delay: 1500 },
      { id: '4', text: 'Checking nullifier against previous votes (prevents double voting)', icon: 'fas fa-shield-alt', status: 'pending', delay: 2000 },
      { id: '5', text: 'Generating witness for vote choice', icon: 'fas fa-eye', status: 'pending', delay: 2500 },
      { id: '6', text: 'Computing zero-knowledge proof of valid vote', icon: 'fas fa-lock', status: 'pending', delay: 3000 },
      { id: '7', text: 'Vote recorded successfully - nullifier stored to prevent duplicates', icon: 'fas fa-certificate', status: 'pending', delay: 3500, isSuccess: true, details: 'Vote recorded: 0x4a7b...c8f2' }
    ],
    code: `// Midnight Compact Language Example
circuit ConfidentialVote {
    private input voter_id: Field;
    private input choice: Field;
    private input nullifier_secret: Field;
    
    public input nullifier_hash: Field;
    public output commitment: Field;
    
    // Hash voter credentials
    let vote_hash = hash(voter_id, choice);
    
    // Generate nullifier to prevent double voting
    let nullifier = hash(voter_id, nullifier_secret);
    assert(nullifier == nullifier_hash);
    
    // Create commitment
    commitment = hash(vote_hash, nullifier);
    
    // Verify choice is valid (0-2 for 3 candidates)
    assert(choice >= 0 && choice <= 2);
}`,
    inputs: [
      { label: 'Voter ID', key: 'voter_id', type: 'text', defaultValue: 'voter_12345' },
      { label: 'Private Credentials', key: 'private_credentials', type: 'text', defaultValue: 'SSN:***-**-1234', isPrivate: true },
      { label: 'Secret Nullifier', key: 'secret_nullifier', type: 'text', defaultValue: 'secret_nonce_abc123', isPrivate: true },
      { label: 'Candidate Choice', key: 'choice', type: 'select', options: ['Candidate A', 'Candidate B', 'Candidate C'], defaultValue: 'Candidate A' }
    ]
  },
  {
    id: 'auction',
    name: 'Sealed Bid Auction',
    description: 'Private bid commitment',
    icon: 'fas fa-gavel',
    circuit: {
      nodes: [
        {
          id: 'bid-input',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Private Bid Amount',
            icon: 'fas fa-eye-slash',
            description: 'Secret Bid (Hidden)',
            color: '#EF4444',
            isPrivate: true
          }
        },
        {
          id: 'commit-1',
          type: 'commit',
          position: { x: 350, y: 100 },
          data: {
            label: 'Commitment',
            icon: 'fas fa-lock',
            description: 'Pedersen Commitment',
            color: '#F59E0B'
          }
        },
        {
          id: 'range-proof',
          type: 'verify',
          position: { x: 200, y: 250 },
          data: {
            label: 'Range Proof',
            icon: 'fas fa-chart-line',
            description: 'Bid > Min Amount',
            color: '#10B981'
          }
        },
        {
          id: 'reveal',
          type: 'output',
          position: { x: 450, y: 250 },
          data: {
            label: 'Reveal Phase',
            icon: 'fas fa-eye',
            description: 'Winner Selection',
            color: '#8B5CF6'
          }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'bid-input', target: 'commit-1', animated: true },
        { id: 'e1-3', source: 'bid-input', target: 'range-proof', animated: true },
        { id: 'e2-4', source: 'commit-1', target: 'reveal', animated: true },
        { id: 'e3-4', source: 'range-proof', target: 'reveal', animated: true }
      ]
    },
    proofSteps: [
      { id: '1', text: 'Creating private bid commitment with nonce', icon: 'fas fa-lock', status: 'pending', delay: 500 },
      { id: '2', text: 'Generating nullifier from bidder identity (prevents multiple bids)', icon: 'fas fa-ban', status: 'pending', delay: 1000 },
      { id: '3', text: 'Checking bidder nullifier against previous submissions', icon: 'fas fa-shield-alt', status: 'pending', delay: 1500 },
      { id: '4', text: 'Verifying minimum bid constraint with range proof', icon: 'fas fa-chart-line', status: 'pending', delay: 2000 },
      { id: '5', text: 'Computing zero-knowledge proof of valid bid', icon: 'fas fa-calculator', status: 'pending', delay: 2500 },
      { id: '6', text: 'Bid submitted successfully - bidder nullifier recorded', icon: 'fas fa-gavel', status: 'pending', delay: 3000, isSuccess: true, details: 'Commitment: 0x8c2a...f7b1' }
    ],
    code: `// Sealed Bid Auction Circuit
circuit SealedBidAuction {
    private input bid_amount: Field;
    private input nonce: Field;
    
    public input min_bid: Field;
    public output commitment: Field;
    
    // Ensure bid meets minimum
    assert(bid_amount >= min_bid);
    
    // Create Pedersen commitment
    commitment = pedersen_commit(bid_amount, nonce);
    
    // Range proof for valid bid amount
    range_check(bid_amount, 0, MAX_BID);
}`,
    inputs: [
      { label: 'Public Minimum Bid', key: 'min_bid', type: 'number', defaultValue: '500' },
      { label: 'Private Bid Amount', key: 'bid_amount', type: 'number', defaultValue: '1000', isPrivate: true },
      { label: 'Private Bidder Identity', key: 'bidder_secret', type: 'text', defaultValue: 'bidder_key_xyz789', isPrivate: true },
      { label: 'Private Random Nonce', key: 'random_nonce', type: 'text', defaultValue: 'nonce_abc123def456', isPrivate: true }
    ]
  },
  {
    id: 'identity',
    name: 'Anonymous Identity',
    description: 'Identity verification without revealing',
    icon: 'fas fa-user-secret',
    circuit: {
      nodes: [
        {
          id: 'identity-input',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Private Identity',
            icon: 'fas fa-user-secret',
            description: 'Age, Credentials (Hidden)',
            color: '#EF4444',
            isPrivate: true
          }
        },
        {
          id: 'merkle-proof',
          type: 'verify',
          position: { x: 350, y: 100 },
          data: {
            label: 'Merkle Proof',
            icon: 'fas fa-tree',
            description: 'Registry Membership',
            color: '#10B981'
          }
        },
        {
          id: 'age-check',
          type: 'verify',
          position: { x: 200, y: 250 },
          data: {
            label: 'Age Verification',
            icon: 'fas fa-calendar',
            description: 'Age >= 18',
            color: '#F59E0B'
          }
        },
        {
          id: 'anon-output',
          type: 'output',
          position: { x: 450, y: 250 },
          data: {
            label: 'Anonymous Token',
            icon: 'fas fa-key',
            description: 'Verified Identity',
            color: '#8B5CF6'
          }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'identity-input', target: 'merkle-proof', animated: true },
        { id: 'e1-3', source: 'identity-input', target: 'age-check', animated: true },
        { id: 'e2-4', source: 'merkle-proof', target: 'anon-output', animated: true },
        { id: 'e3-4', source: 'age-check', target: 'anon-output', animated: true }
      ]
    },
    proofSteps: [
      { id: '1', text: 'Loading private identity credentials (age, SSN)', icon: 'fas fa-user-secret', status: 'pending', delay: 500 },
      { id: '2', text: 'Generating identity nullifier from SSN + birth cert hash', icon: 'fas fa-ban', status: 'pending', delay: 1000 },
      { id: '3', text: 'Checking identity nullifier (prevents duplicate verifications)', icon: 'fas fa-shield-alt', status: 'pending', delay: 1500 },
      { id: '4', text: 'Computing Merkle proof of registry membership', icon: 'fas fa-tree', status: 'pending', delay: 2000 },
      { id: '5', text: 'Validating age >= 18 constraint without revealing actual age', icon: 'fas fa-calendar', status: 'pending', delay: 2500 },
      { id: '6', text: 'Identity verified anonymously - nullifier stored', icon: 'fas fa-key', status: 'pending', delay: 3000, isSuccess: true, details: 'Token: 0x9f3e...a8d4' }
    ],
    code: `// Anonymous Identity Verification
circuit AnonymousIdentity {
    private input age: Field;
    private input identity_hash: Field;
    private input merkle_path: Field[10];
    
    public input merkle_root: Field;
    public output anonymous_token: Field;
    
    // Verify age requirement
    assert(age >= 18);
    
    // Verify membership in registry
    let computed_root = merkle_verify(identity_hash, merkle_path);
    assert(computed_root == merkle_root);
    
    // Generate anonymous token
    anonymous_token = hash(identity_hash, age);
}`,
    inputs: [
      { label: 'Identity Type', key: 'identity_type', type: 'select', options: ['Government ID', 'Passport', 'Driver License'], defaultValue: 'Government ID' },
      { label: 'Private Age', key: 'age', type: 'number', defaultValue: '25', isPrivate: true },
      { label: 'Private SSN', key: 'private_ssn', type: 'text', defaultValue: '***-**-5678', isPrivate: true },
      { label: 'Private Birth Certificate Hash', key: 'birth_cert_hash', type: 'text', defaultValue: '0x8a7f...b3c2', isPrivate: true }
    ]
  }
];
