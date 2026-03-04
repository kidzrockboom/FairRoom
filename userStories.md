# FairRoom User Stories

**Status**: Draft for Gate 0 review
**Purpose**: Consolidated and standardized user stories based on current team submissions
**Note**: This version keeps 15 distinct stories and balances ownership at 5 per team member. Final wording can still be refined after team sign-off.

---

## Richard (5 Stories)

### US-001: Search Available Rooms
**Author**: Richard  
**Priority**: Must-Have  
**Estimated Complexity**: Medium

As a **student**, I want to **search for available rooms** so that **I can find a room I am able to book**.

#### Acceptance Criteria
- AC1: User can search available rooms for a selected date
- AC2: System shows only rooms that are currently available for the selected date or slot
- AC3: Search results display enough basic information to help the user choose a room

### US-002: Receive A Booking Reminder
**Author**: Richard  
**Priority**: Should-Have  
**Estimated Complexity**: Medium

As a **student**, I want to **receive a reminder before my booking starts** so that **I do not forget my reserved room**.

#### Acceptance Criteria
- AC1: System creates a reminder for an active booking
- AC2: Reminder is delivered before the booking start time
- AC3: Reminder includes the correct room, date, and time details

### US-003: View My Booking List
**Author**: Richard  
**Priority**: Must-Have  
**Estimated Complexity**: Low

As a **student**, I want to **view a list of my bookings** so that **I can track my reservations easily**.

#### Acceptance Criteria
- AC1: User can access a page that lists only their own bookings
- AC2: Each booking shows the room, date, time, and current status
- AC3: The list includes active and previous bookings or clearly separates them

### US-004: Modify A Booking Before The Deadline
**Author**: Richard  
**Priority**: Should-Have  
**Estimated Complexity**: Medium

As a **student**, I want to **change an existing booking before the allowed deadline** so that **I can adjust my plan without creating a new booking from scratch**.

#### Acceptance Criteria
- AC1: User can edit an eligible booking before the modification deadline
- AC2: System rejects edits after the allowed cut-off time
- AC3: If the update succeeds, the new booking details replace the old ones correctly

### US-005: Cancel A Booking Before The Deadline
**Author**: Richard  
**Priority**: Should-Have  
**Estimated Complexity**: Low

As a **student**, I want to **cancel an existing booking before the allowed deadline** so that **the room can be released for other users**.

#### Acceptance Criteria
- AC1: User can cancel an eligible booking before the cancellation deadline
- AC2: A canceled booking no longer appears as active
- AC3: The released room slot becomes available to other users again

---

## Ismail (5 Stories)

### US-006: Book A Room For A Specific Date And Time
**Author**: Ismail  
**Priority**: Must-Have  
**Estimated Complexity**: Medium

As a **student**, I want to **book a room for a specific date and time** so that **I can reserve study space in advance**.

#### Acceptance Criteria
- AC1: User can choose a room, date, and time slot before submitting a booking
- AC2: System stores the booking when the selected slot is valid and available
- AC3: User receives a clear success message when the booking is created

### US-007: View All Room Bookings
**Author**: Ismail  
**Priority**: Should-Have  
**Estimated Complexity**: Medium

As an **admin**, I want to **view all room bookings** so that **I can monitor room usage across the system**.

#### Acceptance Criteria
- AC1: Admin can access a list of all bookings in the system
- AC2: Each booking entry shows the user, room, date, time, and status
- AC3: Admin can review bookings without changing normal student booking data by accident

### US-008: Manage User Strike Counts
**Author**: Ismail  
**Priority**: Should-Have  
**Estimated Complexity**: Medium

As an **admin**, I want to **view and manage user strike counts** so that **I can enforce the no-show policy fairly**.

#### Acceptance Criteria
- AC1: Admin can view each user's current strike count
- AC2: Admin can update or reset a strike count when appropriate
- AC3: Updated strike counts are saved and reflected in later booking checks

### US-009: Manage Room Inventory
**Author**: Ismail  
**Priority**: Should-Have  
**Estimated Complexity**: Medium

As an **admin**, I want to **add or remove rooms from the system** so that **only valid rooms can be booked by users**.

#### Acceptance Criteria
- AC1: Admin can add a new room with the required room details
- AC2: Admin can remove or disable a room that should no longer be bookable
- AC3: Rooms removed from availability can no longer appear as bookable to students

### US-010: Review Room Usage
**Author**: Ismail  
**Priority**: Could-Have  
**Estimated Complexity**: Low

As an **admin**, I want to **review room usage activity** so that **I can understand how rooms are being used over time**.

#### Acceptance Criteria
- AC1: Admin can view booking activity grouped by room or date
- AC2: The system shows enough usage information to identify heavily used rooms
- AC3: Usage information is based on stored booking records already in the system

---

## Freeman (5 Stories)

### US-011: Filter Rooms By Capacity And Time
**Author**: Freeman  
**Priority**: Must-Have  
**Estimated Complexity**: Medium

As a **student**, I want to **filter room results by capacity and preferred time** so that **I can find a room that matches my group's needs**.

#### Acceptance Criteria
- AC1: User can apply a capacity filter to room results
- AC2: User can apply a preferred time filter when searching for rooms
- AC3: The system updates results so that only matching rooms and slots are shown

### US-012: View Room Availability Details
**Author**: Freeman  
**Priority**: Must-Have  
**Estimated Complexity**: Low

As a **student**, I want to **view room details and available time slots before booking** so that **I can make an informed booking choice**.

#### Acceptance Criteria
- AC1: User can view room details such as room name, location, and capacity
- AC2: The system shows available time slots for the selected room
- AC3: Unavailable time slots are not shown as bookable options

### US-013: Prevent Double-Booking
**Author**: Freeman  
**Priority**: Must-Have  
**Estimated Complexity**: Medium

As a **student**, I want the system to **reject overlapping bookings** so that **I do not try to reserve a room that has already been taken**.

#### Acceptance Criteria
- AC1: System checks for booking conflicts before confirming a new booking
- AC2: If a conflict exists, the new booking is rejected and no duplicate booking is created
- AC3: The user sees a clear message explaining that the slot is no longer available

### US-014: View My Strike Count
**Author**: Freeman  
**Priority**: Must-Have  
**Estimated Complexity**: Low

As a **student**, I want to **see my current strike count** so that **I understand my booking status and the risk of being blocked**.

#### Acceptance Criteria
- AC1: User can view their current strike count from their account or dashboard area
- AC2: The displayed strike count updates when a new strike is recorded or removed
- AC3: The system clearly shows when the user is close to the booking limit

### US-015: Enforce The Three-Strike Rule
**Author**: Freeman  
**Priority**: Must-Have  
**Estimated Complexity**: High

As the **FairRoom system**, I want to **block users from creating new bookings after they reach three strikes** so that **room usage remains fair and repeated misuse is discouraged**.

#### Acceptance Criteria
- AC1: System checks a user's strike count before allowing a booking to be created
- AC2: If a user has three or more strikes, the booking request is rejected
- AC3: The rejection message clearly explains that the booking failed because the strike limit has been reached
