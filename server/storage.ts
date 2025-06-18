import { 
  users, mechanics, serviceRequests, serviceHistory, messages,
  type User, type InsertUser,
  type Mechanic, type InsertMechanic,
  type ServiceRequest, type InsertServiceRequest,
  type ServiceHistory, type InsertServiceHistory,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLocation(id: number, latitude: string, longitude: string, address: string): Promise<User | undefined>;

  // Mechanic operations
  getAllMechanics(): Promise<Mechanic[]>;
  getMechanic(id: number): Promise<Mechanic | undefined>;
  getNearbyMechanics(latitude: number, longitude: number, radius?: number): Promise<Mechanic[]>;
  updateMechanicAvailability(id: number, availability: string): Promise<Mechanic | undefined>;

  // Service request operations
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  getUserServiceRequests(userId: number): Promise<ServiceRequest[]>;
  getMechanicServiceRequests(mechanicId: number): Promise<ServiceRequest[]>;
  updateServiceRequestStatus(id: number, status: string, mechanicId?: number): Promise<ServiceRequest | undefined>;
  assignMechanicToRequest(requestId: number, mechanicId: number, estimatedArrival: Date, estimatedPrice: string): Promise<ServiceRequest | undefined>;

  // Service history operations
  getUserServiceHistory(userId: number): Promise<ServiceHistory[]>;
  createServiceHistory(history: InsertServiceHistory): Promise<ServiceHistory>;

  // Message operations
  getRequestMessages(requestId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mechanics: Map<number, Mechanic>;
  private serviceRequests: Map<number, ServiceRequest>;
  private serviceHistory: Map<number, ServiceHistory>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentMechanicId: number;
  private currentRequestId: number;
  private currentHistoryId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.mechanics = new Map();
    this.serviceRequests = new Map();
    this.serviceHistory = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentMechanicId = 1;
    this.currentRequestId = 1;
    this.currentHistoryId = 1;
    this.currentMessageId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed mechanics
    const sampleMechanics: InsertMechanic[] = [
      {
        name: "Sarah Johnson",
        businessName: "Sarah's Mobile Repair",
        phone: "(555) 123-4567",
        email: "sarah@mobilerepaur.com",
        latitude: "40.7589",
        longitude: "-73.9851",
        address: "Manhattan, NY",
        rating: "4.9",
        reviewCount: 127,
        services: ["Battery", "Towing", "Tire Service", "Lockout"],
        availability: "available",
        responseTime: 12,
        priceRange: "$45-120",
        is24x7: false,
      },
      {
        name: "Mike Rodriguez",
        businessName: "QuickFix Auto",
        phone: "(555) 234-5678",
        email: "mike@quickfixauto.com",
        latitude: "40.7505",
        longitude: "-73.9934",
        address: "Manhattan, NY",
        rating: "4.7",
        reviewCount: 89,
        services: ["All Services", "Emergency Repair", "Diagnostics"],
        availability: "busy",
        responseTime: 25,
        priceRange: "$55-150",
        is24x7: true,
      },
      {
        name: "David Chen",
        businessName: "Roadside Heroes",
        phone: "(555) 345-6789",
        email: "david@roadsideheroes.com",
        latitude: "40.7614",
        longitude: "-73.9776",
        address: "Manhattan, NY",
        rating: "4.8",
        reviewCount: 156,
        services: ["Towing", "Battery", "Fuel Delivery", "Tire Service"],
        availability: "available",
        responseTime: 18,
        priceRange: "$40-100",
        is24x7: false,
      }
    ];

    sampleMechanics.forEach(mechanic => {
      const id = this.currentMechanicId++;
      this.mechanics.set(id, { ...mechanic, id });
    });

    // Create a sample user
    const sampleUser: InsertUser = {
      username: "john_doe",
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 987-6543",
      address: "123 Main Street, Manhattan, NY",
      latitude: "40.7580",
      longitude: "-73.9855",
    };
    
    const userId = this.currentUserId++;
    this.users.set(userId, { ...sampleUser, id: userId });

    // Seed service history
    const sampleHistory: InsertServiceHistory[] = [
      {
        userId: 1,
        mechanicId: 2,
        serviceType: "Battery Jump",
        description: "Dead battery in parking garage",
        price: "55.00",
        rating: 5,
        review: "Quick and professional service",
        completedAt: new Date("2024-10-15T14:30:00Z"),
      },
      {
        userId: 1,
        mechanicId: 2,
        serviceType: "Tire Replacement",
        description: "Flat tire on highway",
        price: "120.00",
        rating: 4,
        review: "Good service, took a bit longer than expected",
        completedAt: new Date("2024-09-28T16:45:00Z"),
      }
    ];

    sampleHistory.forEach(history => {
      const id = this.currentHistoryId++;
      this.serviceHistory.set(id, { ...history, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserLocation(id: number, latitude: string, longitude: string, address: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, latitude, longitude, address };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllMechanics(): Promise<Mechanic[]> {
    return Array.from(this.mechanics.values());
  }

  async getMechanic(id: number): Promise<Mechanic | undefined> {
    return this.mechanics.get(id);
  }

  async getNearbyMechanics(latitude: number, longitude: number, radius: number = 10): Promise<Mechanic[]> {
    // Simple distance calculation - in a real app, you'd use proper geospatial queries
    return Array.from(this.mechanics.values()).filter(mechanic => {
      const mechanicLat = parseFloat(mechanic.latitude);
      const mechanicLng = parseFloat(mechanic.longitude);
      const distance = this.calculateDistance(latitude, longitude, mechanicLat, mechanicLng);
      return distance <= radius;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateMechanicAvailability(id: number, availability: string): Promise<Mechanic | undefined> {
    const mechanic = this.mechanics.get(id);
    if (mechanic) {
      const updatedMechanic = { ...mechanic, availability };
      this.mechanics.set(id, updatedMechanic);
      return updatedMechanic;
    }
    return undefined;
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = this.currentRequestId++;
    const request: ServiceRequest = {
      ...insertRequest,
      id,
      mechanicId: null,
      status: "pending",
      estimatedPrice: null,
      finalPrice: null,
      estimatedArrival: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceRequests.set(id, request);
    return request;
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async getUserServiceRequests(userId: number): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(request => request.userId === userId);
  }

  async getMechanicServiceRequests(mechanicId: number): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(request => request.mechanicId === mechanicId);
  }

  async updateServiceRequestStatus(id: number, status: string, mechanicId?: number): Promise<ServiceRequest | undefined> {
    const request = this.serviceRequests.get(id);
    if (request) {
      const updatedRequest = {
        ...request,
        status,
        mechanicId: mechanicId || request.mechanicId,
        updatedAt: new Date(),
        completedAt: status === "completed" ? new Date() : request.completedAt
      };
      this.serviceRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  async assignMechanicToRequest(requestId: number, mechanicId: number, estimatedArrival: Date, estimatedPrice: string): Promise<ServiceRequest | undefined> {
    const request = this.serviceRequests.get(requestId);
    if (request) {
      const updatedRequest = {
        ...request,
        mechanicId,
        status: "assigned",
        estimatedArrival,
        estimatedPrice,
        updatedAt: new Date(),
      };
      this.serviceRequests.set(requestId, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  async getUserServiceHistory(userId: number): Promise<ServiceHistory[]> {
    return Array.from(this.serviceHistory.values()).filter(history => history.userId === userId);
  }

  async createServiceHistory(insertHistory: InsertServiceHistory): Promise<ServiceHistory> {
    const id = this.currentHistoryId++;
    const history: ServiceHistory = {
      ...insertHistory,
      id,
      createdAt: new Date(),
    };
    this.serviceHistory.set(id, history);
    return history;
  }

  async getRequestMessages(requestId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => message.requestId === requestId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
