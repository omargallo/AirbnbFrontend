import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User } from '../../../../core/services/Admin/user-service';
import { BookingService, BookingDetailsDTO } from '../../../../core/services/Admin/booking-service';
import { PropertyService } from '../../../../core/services/Property/property.service';
import { PropertyAcceptStatus, PropertyDisplayWithHostDataDto } from '../../../add-property/models/property.model';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
  users: number;
  properties: number;
}

interface AnalyticsMetrics {
  // Financial Metrics
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageBookingValue: number;
  revenueGrowth: number;
  
  // Performance Metrics
  occupancyRate: number;
  averageStayDuration: number;
  bookingConversionRate: number;
  customerRetentionRate: number;
  
  // Growth Metrics
  userGrowthRate: number;
  propertyGrowthRate: number;
  bookingGrowthRate: number;
  
  // Geographic Data
  topCities: ChartData[];
  topCountries: ChartData[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  
  // Loading States
  loading: boolean = false;
  chartLoading: boolean = false;
  
  // Data Collections
  users: User[] = [];
  bookings: BookingDetailsDTO[] = [];
  properties: PropertyDisplayWithHostDataDto[] = [];
  
  // NEW: Profit breakdown properties
  websiteProfit: number = 0;
  hostProfit: number = 0;
  totalCompletedBookings: number = 0;
  
  // Analytics Data
  analytics: AnalyticsMetrics = {
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    averageBookingValue: 0,
    revenueGrowth: 0,
    occupancyRate: 0,
    averageStayDuration: 0,
    bookingConversionRate: 0,
    customerRetentionRate: 0,
    userGrowthRate: 0,
    propertyGrowthRate: 0,
    bookingGrowthRate: 0,
    topCities: [],
    topCountries: []
  };
  
  // Chart Data
  monthlyRevenueData: MonthlyData[] = [];
  bookingStatusData: ChartData[] = [];
  propertyStatusData: ChartData[] = [];
  userActivityData: ChartData[] = [];
  
  // Time Period Selection
  selectedPeriod: string = 'monthly';
  periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];
  
  // Current Date for calculations
  currentDate = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnalyticsData(): void {
    this.loading = true;
    
    Promise.all([
      this.loadUsersData(),
      this.loadBookingsData(),
      this.loadPropertiesData()
    ]).then(() => {
      this.calculateAnalytics();
      this.prepareChartData();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading analytics data:', error);
      this.loading = false;
    });
  }

  private loadUsersData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users: User[]) => {
            this.users = Array.isArray(users) ? users : [];
            resolve();
          },
          error: (error) => {
            console.error('Error loading users:', error);
            this.users = [];
            resolve(); // Continue with empty data
          }
        });
    });
  }

  private loadBookingsData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookingService.getAllBookings()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (bookings: BookingDetailsDTO[]) => {
            this.bookings = Array.isArray(bookings) ? bookings : [];
            resolve();
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
            this.bookings = [];
            resolve(); // Continue with empty data
          }
        });
    });
  }

  private loadPropertiesData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.propertyService.getAllForDashboard()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (properties: PropertyDisplayWithHostDataDto[]) => {
            this.properties = Array.isArray(properties) ? properties : [];
            resolve();
          },
          error: (error) => {
            console.error('Error loading properties:', error);
            this.properties = [];
            resolve(); // Continue with empty data
          }
        });
    });
  }

  private calculateAnalytics(): void {
    // Financial Analytics
    this.calculateFinancialMetrics();
    
    // Performance Analytics
    this.calculatePerformanceMetrics();
    
    // Growth Analytics
    this.calculateGrowthMetrics();
    
    // Geographic Analytics
    this.calculateGeographicMetrics();
  }

  // UPDATED: Financial metrics calculation with profit breakdown
  private calculateFinancialMetrics(): void {
    const completedBookings = this.bookings.filter(b => 
      b.bookingStatus?.toLowerCase() === 'confirmed'
    );
    
    // Count total completed bookings
    this.totalCompletedBookings = completedBookings.length;
    
    this.analytics.totalRevenue = completedBookings.reduce((sum, booking) => 
      sum + (booking.totalPrice || 0), 0
    );
    
    // Calculate profits - Website gets 10%, Host gets 90% (matching dashboard details)
    this.websiteProfit = this.analytics.totalRevenue * 0.10;
    this.hostProfit = this.analytics.totalRevenue * 0.90;
    
    // Monthly revenue (current month)
    const currentMonth = this.currentDate.getMonth();
    const currentYear = this.currentDate.getFullYear();
    
    const monthlyBookings = completedBookings.filter(booking => {
      const bookingDate = new Date(booking.checkInDate);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });
    
    this.analytics.monthlyRevenue = monthlyBookings.reduce((sum, booking) => 
      sum + (booking.totalPrice || 0), 0
    );
    
    // Yearly revenue
    const yearlyBookings = completedBookings.filter(booking => {
      const bookingDate = new Date(booking.checkInDate);
      return bookingDate.getFullYear() === currentYear;
    });
    
    this.analytics.yearlyRevenue = yearlyBookings.reduce((sum, booking) => 
      sum + (booking.totalPrice || 0), 0
    );
    
    // Average booking value
    this.analytics.averageBookingValue = completedBookings.length > 0 
      ? this.analytics.totalRevenue / completedBookings.length 
      : 0;
    
    // Revenue growth (comparing with previous month)
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previousMonthBookings = completedBookings.filter(booking => {
      const bookingDate = new Date(booking.checkInDate);
      return bookingDate.getMonth() === previousMonth && 
             bookingDate.getFullYear() === previousYear;
    });
    
    const previousMonthRevenue = previousMonthBookings.reduce((sum, booking) => 
      sum + (booking.totalPrice || 0), 0
    );
    
    this.analytics.revenueGrowth = previousMonthRevenue > 0 
      ? ((this.analytics.monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;
  }

  private calculatePerformanceMetrics(): void {
    // Occupancy rate calculation (simplified)
    const totalPossibleBookingDays = this.properties.length * 365;
    const actualBookingDays = this.bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    
    this.analytics.occupancyRate = totalPossibleBookingDays > 0 
      ? (actualBookingDays / totalPossibleBookingDays) * 100
      : 0;
    
    // Average stay duration
    const totalStayDuration = this.bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    
    this.analytics.averageStayDuration = this.bookings.length > 0 
      ? totalStayDuration / this.bookings.length
      : 0;
    
    // Booking conversion rate (completed vs total)
    const completedBookings = this.bookings.filter(b => 
      b.bookingStatus?.toLowerCase() === 'confirmed'
    ).length;
    
    this.analytics.bookingConversionRate = this.bookings.length > 0 
      ? (completedBookings / this.bookings.length) * 100
      : 0;
    
    // Customer retention rate (users with multiple bookings)
    const userBookingCounts = this.bookings.reduce((acc, booking) => {
      acc[booking.userId] = (acc[booking.userId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const returningUsers = Object.values(userBookingCounts).filter(count => count > 1).length;
    const totalUniqueUsers = Object.keys(userBookingCounts).length;
    
    this.analytics.customerRetentionRate = totalUniqueUsers > 0 
      ? (returningUsers / totalUniqueUsers) * 100
      : 0;
  }

  private calculateGrowthMetrics(): void {
    // Calculate growth rates for the past 30 days vs previous 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    // User growth rate (if creation date is available)
    // This is simplified - you'd need user creation dates from your API
    this.analytics.userGrowthRate = 5.2; // Placeholder
    
    // Property growth rate
    this.analytics.propertyGrowthRate = 3.8; // Placeholder
    
    // Booking growth rate
    const recentBookings = this.bookings.filter(booking => 
      new Date(booking.checkInDate) >= thirtyDaysAgo
    ).length;
    
    const previousPeriodBookings = this.bookings.filter(booking => {
      const checkInDate = new Date(booking.checkInDate);
      return checkInDate >= sixtyDaysAgo && checkInDate < thirtyDaysAgo;
    }).length;
    
    this.analytics.bookingGrowthRate = previousPeriodBookings > 0 
      ? ((recentBookings - previousPeriodBookings) / previousPeriodBookings) * 100
      : 0;
  }

  private calculateGeographicMetrics(): void {
    // Top cities
    const cityCount = this.bookings.reduce((acc, booking) => {
      if (booking.city) {
        acc[booking.city] = (acc[booking.city] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
    
    this.analytics.topCities = Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({
        label: city,
        value: count,
        color: this.getRandomColor()
      }));
    
    // Top countries
    const countryCount = this.bookings.reduce((acc, booking) => {
      if (booking.country) {
        acc[booking.country] = (acc[booking.country] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
    
    this.analytics.topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({
        label: country,
        value: count,
        color: this.getRandomColor()
      }));
  }

  private prepareChartData(): void {
    this.prepareMonthlyRevenueData();
    this.prepareBookingStatusData();
    this.preparePropertyStatusData();
    this.prepareUserActivityData();
  }

  private prepareMonthlyRevenueData(): void {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentYear = this.currentDate.getFullYear();
    
    this.monthlyRevenueData = monthNames.map((month, index) => {
      const monthlyBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.checkInDate);
        return bookingDate.getMonth() === index && 
               bookingDate.getFullYear() === currentYear &&
               booking.bookingStatus?.toLowerCase() === 'confirmed';
      });
      
      const monthlyRevenue = monthlyBookings.reduce((sum, booking) => 
        sum + (booking.totalPrice || 0), 0
      );
      
      return {
        month,
        revenue: monthlyRevenue,
        bookings: monthlyBookings.length,
        users: new Set(monthlyBookings.map(b => b.userId)).size,
        properties: new Set(monthlyBookings.map(b => b.propertyId)).size
      };
    });
  }

  private prepareBookingStatusData(): void {
    const statusCount = this.bookings.reduce((acc, booking) => {
      const status = booking.bookingStatus || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const statusColors = {
      'completed': '#28a745',
      'pending': '#ffc107',
      'cancelled': '#dc3545',
      'confirmed': '#17a2b8'
    };
    
    this.bookingStatusData = Object.entries(statusCount).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status.toLowerCase() as keyof typeof statusColors] || '#6c757d'
    }));
  }

  private preparePropertyStatusData(): void {
  const statusCount = {
    'Accepted': this.properties.filter(p => p.status === PropertyAcceptStatus.accepted).length,
    // Fix: Use the same logic as in other components
    'Pending': this.properties.filter(p => p.status === PropertyAcceptStatus.pending).length,
    'Rejected': this.properties.filter(p => p.status === PropertyAcceptStatus.rejected).length,
    'Deleted': this.properties.filter(p => p.isDeleted).length
  };
  
  const statusColors = {
    'Accepted': '#28a745',
    'Pending': '#ffc107',
    'Rejected': '#dc3545',
    'Deleted': '#6c757d'
  };
  
  this.propertyStatusData = Object.entries(statusCount).map(([status, count]) => ({
    label: status,
    value: count,
    color: statusColors[status as keyof typeof statusColors]
  }));
}

  private prepareUserActivityData(): void {
    const activeUsers = this.users.filter(user => user.isConfirmed).length;
    const inactiveUsers = this.users.length - activeUsers;
    
    this.userActivityData = [
      { label: 'Active Users', value: activeUsers, color: '#28a745' },
      { label: 'Inactive Users', value: inactiveUsers, color: '#6c757d' }
    ];
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  }

  getMaxRevenue(): number {
    return Math.max(...this.monthlyRevenueData.map(data => data.revenue), 1);
  }

  getTotalUsersCount(): number {
    return Math.max(this.users.length, 1);
  }

  getTodayRevenue(): number {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todayBookings = this.bookings.filter(booking => {
      const bookingDate = new Date(booking.checkInDate).toISOString().split('T')[0];
      return bookingDate === todayStr && booking.bookingStatus?.toLowerCase() === 'confirmed';
    });
    
    return todayBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => user.isConfirmed).length;
  }

  getPendingBookingsCount(): number {
    return this.bookings.filter(booking => 
      booking.bookingStatus?.toLowerCase() === 'pending'
    ).length;
  }

  getAvailablePropertiesCount(): number {
    return this.properties.filter(property => 
      property.status === PropertyAcceptStatus.accepted && !property.isDeleted
    ).length;
  }

  getPercentageWidth(value: number, dataArray: ChartData[] | undefined): number {
    if (!dataArray || dataArray.length === 0) return 0;
    const maxValue = dataArray[0]?.value || 1;
    return (value / maxValue) * 100;
  }

  getRevenuePerUser(): number {
    return this.analytics.totalRevenue / (this.users.length || 1);
  }

  getRevenuePerProperty(): number {
    return this.analytics.totalRevenue / (this.properties.length || 1);
  }

  getBookingFrequency(): string {
    return (this.bookings.length / (this.users.length || 1)).toFixed(1);
  }

  getPlatformEfficiency(): string {
    return ((this.analytics.totalRevenue * 0.1) / (this.users.length || 1)).toFixed(0);
  }

  // NEW: Getter methods for profit breakdown
  getTotalCompletedBookings(): number {
    return this.totalCompletedBookings;
  }

  getWebsiteProfit(): number {
    return this.websiteProfit;
  }

  getHostProfit(): number {
    return this.hostProfit;
  }

  private getRandomColor(): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Event Handlers
  refreshAnalytics(): void {
    this.loadAnalyticsData();
  }

  exportAnalytics(): void {
    // Implement export functionality
    const analyticsData = {
      timestamp: new Date().toISOString(),
      period: this.selectedPeriod,
      financialMetrics: {
        totalRevenue: this.analytics.totalRevenue,
        monthlyRevenue: this.analytics.monthlyRevenue,
        yearlyRevenue: this.analytics.yearlyRevenue,
        averageBookingValue: this.analytics.averageBookingValue,
        revenueGrowth: this.analytics.revenueGrowth,
        websiteProfit: this.websiteProfit,
        hostProfit: this.hostProfit,
        totalCompletedBookings: this.totalCompletedBookings
      },
      performanceMetrics: {
        occupancyRate: this.analytics.occupancyRate,
        averageStayDuration: this.analytics.averageStayDuration,
        bookingConversionRate: this.analytics.bookingConversionRate,
        customerRetentionRate: this.analytics.customerRetentionRate
      },
      growthMetrics: {
        userGrowthRate: this.analytics.userGrowthRate,
        propertyGrowthRate: this.analytics.propertyGrowthRate,
        bookingGrowthRate: this.analytics.bookingGrowthRate
      },
      geographicData: {
        topCities: this.analytics.topCities,
        topCountries: this.analytics.topCountries
      },
      monthlyData: this.monthlyRevenueData
    };
  
  }
}