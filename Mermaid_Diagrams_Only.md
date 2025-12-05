# RideShare Lite - All Mermaid Diagrams

## Diagram 1: System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        App[App.tsx]
        Theme[ThemeProvider]
        Auth[AuthProvider]
        Nav[AppNavigator]
    end

    subgraph "Navigation Layer"
        Root[RootStack]
        AuthNav[AuthNavigator]
        MainNav[MainNavigator]
    end

    subgraph "Services Layer"
        Supabase[Supabase Client]
        Database[Database Service]
        Routing[Routing Service]
        Notifications[Notification Service]
    end

    subgraph "External APIs"
        SupabaseDB[(Supabase Database)]
        OpenRoute[OpenRouteService API]
        ExpoPush[Expo Push Notifications]
    end

    App --> Theme
    Theme --> Auth
    Auth --> Nav
    Nav --> Root
    Root --> AuthNav
    Root --> MainNav

    Auth --> Supabase
    Database --> Supabase
    Supabase --> SupabaseDB
    Routing --> OpenRoute
    Notifications --> ExpoPush

    MainNav --> Database
    MainNav --> Routing
    MainNav --> Notifications
```

---

## Diagram 2: Complete Navigation Flow

```mermaid
graph TB
    Start([App Launch]) --> Splash[SplashScreen]
    Splash --> CheckAuth{Authenticated?}

    CheckAuth -->|No| AuthStack[Auth Stack Navigator]
    CheckAuth -->|Yes| MainStack[Main Tabs Navigator]

    subgraph "Auth Stack"
        AuthStack --> Landing[Landing Screen]
        Landing -->|Create Account| Signup[Signup Screen]
        Landing -->|Login| Login[Login Screen]
        Signup -->|Success| MainStack
        Login -->|Success| MainStack
        Signup -->|Back| Landing
        Login -->|Back| Landing
    end

    subgraph "Main Tabs - Visible Tabs"
        MainStack --> Home[Home Tab]
        MainStack --> Search[Search Tab]
        MainStack --> Publish[Publish Tab]
        MainStack --> MyRides[My Rides Tab]
        MainStack --> Profile[Profile Tab]
    end

    subgraph "Main Tabs - Hidden Screens"
        Search --> SearchResults[Search Results]
        SearchResults --> RideDetails[Ride Details]
        MyRides --> RideDetails
        Home --> RideDetails

        Profile --> EditProfile[Edit Profile]
        Profile --> Verification[Verification]
        Profile --> NotificationsScreen[Notifications]
        Profile --> Privacy[Privacy]

        RideDetails --> ChatList[Chat List]
        MyRides --> ChatList
        ChatList --> Chat[Chat Screen]
    end

    Profile -->|Logout| AuthStack
```

---

## Diagram 3: Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant AuthContext
    participant Supabase
    participant Database

    User->>App: Launch App
    App->>AuthContext: Initialize
    AuthContext->>Supabase: getSession()

    alt Has Valid Session
        Supabase-->>AuthContext: Return Session
        AuthContext-->>App: User Authenticated
        App->>User: Show Main Tabs
    else No Session
        Supabase-->>AuthContext: No Session
        AuthContext-->>App: User Not Authenticated
        App->>User: Show Landing Screen
    end

    User->>App: Click "Create Account"
    App->>User: Show Signup Screen
    User->>App: Enter Details (Email, Password, Name)
    App->>Supabase: signUp(email, password)
    Supabase-->>App: User Created
    App->>Database: createProfile(userId, fullName)
    Database-->>App: Profile Created
    App->>User: Navigate to Main Tabs

    User->>App: Click "Login"
    App->>User: Show Login Screen
    User->>App: Enter Credentials
    App->>Supabase: signInWithPassword(email, password)
    Supabase-->>App: Session Created
    AuthContext->>AuthContext: Update Session State
    App->>User: Navigate to Main Tabs

    User->>App: Click "Logout" (from Profile)
    App->>Supabase: signOut()
    Supabase-->>App: Session Cleared
    AuthContext->>AuthContext: Clear User State
    App->>User: Navigate to Landing Screen
```

---

## Diagram 4: Passenger User Journey

```mermaid
graph TB
    Start([Passenger Opens App]) --> Auth{Logged In?}
    Auth -->|No| Login[Login/Signup]
    Auth -->|Yes| PassHome[Home Screen]
    Login --> PassHome

    PassHome --> SearchRide[Search for Ride]
    SearchRide --> EnterDetails["Enter:<br/>• From Location<br/>• To Location<br/>• Date<br/>• Passengers"]
    EnterDetails --> SearchResults[View Search Results]

    SearchResults --> FilterSort["Filter/Sort:<br/>• By Price<br/>• By Time<br/>• By Rating<br/>• Instant Booking Only"]
    FilterSort --> SelectRide[Select Ride]

    SelectRide --> ViewDetails["View Ride Details:<br/>• Driver Info<br/>• Vehicle Details<br/>• Route Map<br/>• Stopovers<br/>• Reviews"]

    ViewDetails --> BookDecision{Book Ride?}
    BookDecision -->|No| SearchResults
    BookDecision -->|Yes| BookingType{Instant Booking?}

    BookingType -->|Yes| InstantBook[Instant Confirmation]
    BookingType -->|No| RequestBook[Send Booking Request]

    InstantBook --> BookingConfirmed[Booking Confirmed]
    RequestBook --> WaitApproval[Wait for Driver Approval]
    WaitApproval --> ApprovalCheck{Driver Response?}
    ApprovalCheck -->|Approved| BookingConfirmed
    ApprovalCheck -->|Rejected| SearchResults

    BookingConfirmed --> MyRidesPass[View in My Rides]
    MyRidesPass --> ChatDriver[Chat with Driver]
    MyRidesPass --> ViewBooking["Track Booking:<br/>• Ride Details<br/>• Driver Contact<br/>• Pickup Point"]

    ViewBooking --> RideDay{Ride Day?}
    RideDay -->|Before| WaitRide[Wait for Ride]
    RideDay -->|Day Of| CompleteRide[Complete Ride]
    CompleteRide --> LeaveReview[Leave Review for Driver]
    LeaveReview --> End([Journey Complete])
```

---

## Diagram 5: Driver User Journey

```mermaid
graph TB
    Start([Driver Opens App]) --> Auth{Logged In?}
    Auth -->|No| Login[Login/Signup]
    Auth -->|Yes| DriverHome[Home Screen]
    Login --> DriverHome

    DriverHome --> PublishRide[Publish New Ride]
    PublishRide --> EnterRideDetails["Enter Details:<br/>• From Location<br/>• To Location<br/>• Date & Time<br/>• Available Seats<br/>• Price per Seat<br/>• Vehicle Info<br/>• Instant Booking?<br/>• Stopovers"]

    EnterRideDetails --> RouteCalc[Calculate Route & Stopovers]
    RouteCalc --> PreviewRide[Preview Ride Details]
    PreviewRide --> ConfirmPublish{Publish?}
    ConfirmPublish -->|No| EnterRideDetails
    ConfirmPublish -->|Yes| RidePublished[Ride Published]

    RidePublished --> MyRidesDriver[View in My Rides]
    MyRidesDriver --> ManageRides["Manage Published Rides:<br/>• View Bookings<br/>• Edit Ride<br/>• Cancel Ride"]

    ManageRides --> CheckRequests{New Booking<br/>Requests?}
    CheckRequests -->|Yes| ViewRequests[View Booking Requests]
    ViewRequests --> ReviewRequest["Review Request:<br/>• Passenger Info<br/>• Seats Requested<br/>• Passenger Rating"]

    ReviewRequest --> Decision{Accept?}
    Decision -->|Accept| AcceptBooking[Accept Booking]
    Decision -->|Reject| RejectBooking[Reject Booking]

    AcceptBooking --> UpdateSeats[Update Available Seats]
    UpdateSeats --> NotifyPassenger[Notify Passenger]
    RejectBooking --> NotifyPassenger

    CheckRequests -->|No| WaitBookings[Wait for Bookings]
    NotifyPassenger --> ChatPassenger[Chat with Passengers]

    ChatPassenger --> RideDay{Ride Day?}
    RideDay -->|Before| MonitorBookings[Monitor Bookings]
    RideDay -->|Day Of| CompleteRide[Complete Ride]
    CompleteRide --> ReceiveReviews[Receive Reviews]
    ReceiveReviews --> End([Journey Complete])
```

---

## Diagram 6: Data Flow - Ride Search & Booking

```mermaid
sequenceDiagram
    participant Passenger
    participant SearchScreen
    participant Database
    participant Supabase
    participant RideDetails
    participant Driver

    Passenger->>SearchScreen: Enter search criteria
    SearchScreen->>Database: searchRides(from, to, date, passengers)
    Database->>Supabase: Query rides table with filters
    Supabase-->>Database: Return matching rides
    Database->>Database: Join with profiles (driver info)
    Database-->>SearchScreen: Return rides with driver details
    SearchScreen->>Passenger: Display search results

    Passenger->>SearchScreen: Select a ride
    SearchScreen->>RideDetails: Navigate with rideId
    RideDetails->>Database: fetchRideById(rideId)
    Database->>Supabase: Query ride + driver + reviews
    Supabase-->>Database: Return complete ride data
    Database-->>RideDetails: Ride details
    RideDetails->>Passenger: Show full ride details

    Passenger->>RideDetails: Click "Book Ride"
    RideDetails->>Database: createBooking(rideId, passengerId, seats, price)
    Database->>Supabase: Insert into bookings table
    Supabase-->>Database: Booking created

    alt Instant Booking
        Database->>Database: Auto-confirm booking
        Database->>Database: updateRideSeats(rideId, -seats)
        Database->>Supabase: Update available_seats
        Database-->>RideDetails: Booking confirmed
        RideDetails->>Passenger: Show confirmation
    else Request Booking
        Database-->>RideDetails: Booking pending
        RideDetails->>Passenger: Show "Waiting for approval"
        Database->>Driver: Send notification (booking request)
        Driver->>Database: updateBookingStatus(bookingId, "confirmed")
        Database->>Database: updateRideSeats(rideId, -seats)
        Database->>Passenger: Send notification (booking confirmed)
    end
```

---

## Diagram 7: Data Flow - Ride Publishing

```mermaid
sequenceDiagram
    participant Driver
    participant PublishScreen
    participant Routing
    participant OpenRoute
    participant Database
    participant Supabase

    Driver->>PublishScreen: Enter ride details
    PublishScreen->>Routing: geocodePlace(fromLocation)
    Routing->>OpenRoute: Geocode API request
    OpenRoute-->>Routing: Return coordinates
    Routing-->>PublishScreen: From coordinates

    PublishScreen->>Routing: geocodePlace(toLocation)
    Routing->>OpenRoute: Geocode API request
    OpenRoute-->>Routing: Return coordinates
    Routing-->>PublishScreen: To coordinates

    PublishScreen->>Routing: fetchRoute(startCoords, endCoords)
    Routing->>OpenRoute: Directions API request
    OpenRoute-->>Routing: Route geometry + distance + duration
    Routing->>Routing: extractStopoversFromRoute(geometry)
    Routing->>OpenRoute: Reverse geocode waypoints
    OpenRoute-->>Routing: City names
    Routing-->>PublishScreen: Route with stopovers

    Driver->>PublishScreen: Confirm & Publish
    PublishScreen->>Database: createRide(rideData)
    Database->>Supabase: Insert into rides table
    Supabase-->>Database: Ride created with ID
    Database-->>PublishScreen: Success
    PublishScreen->>Driver: Show "Ride Published"
    PublishScreen->>Driver: Navigate to My Rides
```

---

## Diagram 8: Data Flow - Chat System

```mermaid
sequenceDiagram
    participant User1
    participant ChatScreen
    participant Database
    participant Supabase
    participant User2

    User1->>ChatScreen: Open chat for booking
    ChatScreen->>Database: fetchMessages(bookingId)
    Database->>Supabase: Query messages table
    Supabase-->>Database: Return messages
    Database-->>ChatScreen: Messages with sender/receiver info
    ChatScreen->>User1: Display chat history

    User1->>ChatScreen: Type and send message
    ChatScreen->>Database: sendMessage(bookingId, senderId, receiverId, message)
    Database->>Supabase: Insert into messages table
    Supabase-->>Database: Message created
    Database-->>ChatScreen: Message sent
    ChatScreen->>User1: Update UI with new message

    Database->>User2: Send push notification
    User2->>ChatScreen: Open chat
    ChatScreen->>Database: fetchMessages(bookingId)
    Database->>Supabase: Query messages
    Supabase-->>Database: Return all messages
    Database-->>ChatScreen: Messages
    ChatScreen->>User2: Display chat with new message

    User2->>ChatScreen: Read messages
    ChatScreen->>Database: markMessagesAsRead(bookingId, userId)
    Database->>Supabase: Update read status
    Supabase-->>Database: Updated
    Database-->>ChatScreen: Success
```

---

## Diagram 9: Database Schema Overview

```mermaid
erDiagram
    PROFILES ||--o{ RIDES : publishes
    PROFILES ||--o{ BOOKINGS : makes
    RIDES ||--o{ BOOKINGS : has
    BOOKINGS ||--o{ MESSAGES : contains
    PROFILES ||--o{ MESSAGES : sends
    PROFILES ||--o{ MESSAGES : receives

    PROFILES {
        uuid id PK
        string full_name
        string avatar_url
        string bio
        string phone
        timestamp created_at
    }

    RIDES {
        uuid id PK
        uuid driver_id FK
        string from_location
        string to_location
        date departure_date
        time departure_time
        int available_seats
        decimal price_per_seat
        boolean instant_booking
        string vehicle_type
        string vehicle_model
        jsonb stopovers
        jsonb route_geometry
        timestamp created_at
    }

    BOOKINGS {
        uuid id PK
        uuid ride_id FK
        uuid passenger_id FK
        int seats_booked
        decimal total_price
        enum status
        timestamp created_at
        timestamp updated_at
    }

    MESSAGES {
        uuid id PK
        uuid booking_id FK
        uuid sender_id FK
        uuid receiver_id FK
        text message
        string image_url
        boolean read
        timestamp created_at
    }
```

---

## Diagram 10: Feature Flow - My Rides Screen

```mermaid
graph TB
    Start([User Opens My Rides]) --> CheckRole{User Role?}

    subgraph "Passenger View"
        CheckRole -->|Passenger| FetchPassengerBookings[Fetch Passenger Bookings]
        FetchPassengerBookings --> DisplayBookings["Display Bookings:<br/>• Pending Requests<br/>• Confirmed Rides<br/>• Past Rides"]
        DisplayBookings --> PassengerActions{Action?}
        PassengerActions -->|View Details| ViewBookingDetails[View Booking Details]
        PassengerActions -->|Chat| OpenChat[Open Chat with Driver]
        PassengerActions -->|Cancel| CancelBooking[Cancel Booking]
        CancelBooking --> RestoreSeats[Restore Available Seats]
    end

    subgraph "Driver View"
        CheckRole -->|Driver| FetchDriverRides[Fetch Published Rides]
        FetchDriverRides --> FetchBookingRequests[Fetch Booking Requests]
        FetchBookingRequests --> DisplayDriverView["Display:<br/>• Published Rides<br/>• Pending Requests<br/>• Confirmed Bookings"]
        DisplayDriverView --> DriverActions{Action?}
        DriverActions -->|View Ride| ViewRideDetails[View Ride Details]
        DriverActions -->|Accept Request| AcceptRequest[Accept Booking Request]
        DriverActions -->|Reject Request| RejectRequest[Reject Booking Request]
        DriverActions -->|Edit Ride| EditRide[Edit Ride Details]
        DriverActions -->|Cancel Ride| CancelRide[Cancel Published Ride]
        DriverActions -->|Chat| OpenDriverChat[Open Chat with Passenger]

        AcceptRequest --> UpdateSeatsDeduct[Deduct Available Seats]
        RejectRequest --> NotifyPassengerReject[Notify Passenger]
        CancelRide --> RefundBookings[Refund All Bookings]
    end

    ViewBookingDetails --> End([Done])
    OpenChat --> End
    ViewRideDetails --> End
    OpenDriverChat --> End
    UpdateSeatsDeduct --> End
    NotifyPassengerReject --> End
    RefundBookings --> End
    RestoreSeats --> End
```

---

## Diagram 11: Theme System Flow

```mermaid
graph TB
    Start([App Launch]) --> ThemeProvider[ThemeProvider Initializes]
    ThemeProvider --> LoadPreference[Load Saved Theme from AsyncStorage]

    LoadPreference --> HasSaved{Saved<br/>Preference?}
    HasSaved -->|Yes| ApplySaved[Apply Saved Theme]
    HasSaved -->|No| CheckSystem[Check System Preference]
    CheckSystem --> ApplySystem[Apply System Theme]

    ApplySaved --> ProvideTheme[Provide Theme to App]
    ApplySystem --> ProvideTheme

    ProvideTheme --> RenderApp[Render App with Theme]

    RenderApp --> UserAction{User Action?}
    UserAction -->|Toggle Theme| ToggleTheme[Switch Light/Dark]
    ToggleTheme --> SavePreference[Save to AsyncStorage]
    SavePreference --> UpdateContext[Update Theme Context]
    UpdateContext --> ReRender[Re-render App]
    ReRender --> UserAction

    UserAction -->|Use App| Continue[Continue Using App]
    Continue --> UserAction
```

---

## Diagram 12: Notification Flow

```mermaid
sequenceDiagram
    participant App
    participant NotificationService
    participant ExpoPush
    participant User
    participant Database

    App->>NotificationService: Initialize (on app launch)
    NotificationService->>User: Request notification permissions
    User-->>NotificationService: Grant permissions
    NotificationService->>ExpoPush: Register device for push tokens
    ExpoPush-->>NotificationService: Return push token
    NotificationService->>Database: Save push token to user profile

    Note over Database: Event occurs (booking accepted, new message, etc.)
    Database->>ExpoPush: Send push notification
    ExpoPush->>User: Deliver notification

    alt App in Foreground
        User->>NotificationService: Notification received
        NotificationService->>App: Display in-app notification
    else App in Background
        User->>NotificationService: Tap notification
        NotificationService->>App: Open app
        NotificationService->>App: Navigate to relevant screen
        App->>User: Show chat/booking/ride details
    end
```

---

## Diagram 13: Screen Hierarchy

```mermaid
graph TB
    App[App.tsx] --> Root[RootStack Navigator]

    Root --> Auth[Auth Stack]
    Root --> Main[Main Tabs]

    subgraph "Auth Stack Screens"
        Auth --> Landing[LandingScreen]
        Auth --> Login[LoginScreen]
        Auth --> Signup[SignupScreen]
    end

    subgraph "Main Tab Screens - Visible"
        Main --> Home[HomeScreen]
        Main --> Search[SearchScreen]
        Main --> Publish[PublishScreen]
        Main --> MyRides[MyRidesScreen]
        Main --> Profile[ProfileScreen]
    end

    subgraph "Main Tab Screens - Hidden"
        Main --> SearchResults[SearchResultsScreen]
        Main --> RideDetails[RideDetailsScreen]
        Main --> EditProfile[EditProfileScreen]
        Main --> Verification[VerificationScreen]
        Main --> NotificationsScreen[NotificationsScreen]
        Main --> Privacy[PrivacyScreen]
        Main --> ChatList[ChatListScreen]
        Main --> Chat[ChatScreen]
    end

    subgraph "Splash"
        Root --> Splash[SplashScreen]
    end
```

---

**Total: 13 Mermaid Diagrams**

You can copy any of these code blocks and use them in:
- Mermaid Live Editor (https://mermaid.live)
- GitHub/GitLab markdown files
- Notion, Confluence, or any tool that supports Mermaid
- VS Code with Mermaid preview extensions
