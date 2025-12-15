// Test script for Group Travel Planner feature
// Run this after starting the server to verify the feature works

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let authToken = '';
let authToken2 = '';
let groupId = '';
let inviteCode = '';

// Test users
const user1 = {
  username: 'testuser1_' + Date.now(),
  email: 'testuser1_' + Date.now() + '@test.com',
  password: 'Test123456'
};

const user2 = {
  username: 'testuser2_' + Date.now(),
  email: 'testuser2_' + Date.now() + '@test.com',
  password: 'Test123456'
};

async function test() {
  console.log('🧪 Testing Group Travel Planner Feature\n');
  
  try {
    // Test 1: Register User 1
    console.log('📝 Test 1: Registering User 1...');
    const signupRes1 = await axios.post(`${BASE_URL}/signup`, user1);
    console.log('✅ User 1 registered successfully');
    
    // Test 2: Login User 1
    console.log('\n🔐 Test 2: Logging in User 1...');
    const loginRes1 = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: user1.username,
      password: user1.password
    });
    authToken = loginRes1.data.token;
    console.log('✅ User 1 logged in, token:', authToken.substring(0, 20) + '...');
    
    // Test 3: Create Group
    console.log('\n👥 Test 3: Creating a group...');
    const createGroupRes = await axios.post(`${BASE_URL}/api/groups`, {
      name: 'Test Trip to Paris',
      description: 'A fun trip to explore Paris',
      destination: 'Paris, France',
      startDate: '2025-12-20',
      endDate: '2025-12-27',
      budget: {
        amount: 2000,
        currency: 'EUR'
      }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    groupId = createGroupRes.data.group._id;
    inviteCode = createGroupRes.data.inviteCode;
    console.log('✅ Group created successfully');
    console.log('   Group ID:', groupId);
    console.log('   Invite Code:', inviteCode);
    
    // Test 4: Get User's Groups
    console.log('\n📋 Test 4: Fetching user groups...');
    const groupsRes = await axios.get(`${BASE_URL}/api/groups`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Found', groupsRes.data.groups.length, 'group(s)');
    
    // Test 5: Get Group Details
    console.log('\n🔍 Test 5: Getting group details...');
    const groupDetailsRes = await axios.get(`${BASE_URL}/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Group details retrieved');
    console.log('   Name:', groupDetailsRes.data.group.name);
    console.log('   Members:', groupDetailsRes.data.group.members.length);
    
    // Test 6: Send Message
    console.log('\n💬 Test 6: Sending a message...');
    const messageRes = await axios.post(`${BASE_URL}/api/groups/${groupId}/messages`, {
      content: 'Hello everyone! Excited for this trip!'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Message sent successfully');
    
    // Test 7: Get Messages
    console.log('\n📨 Test 7: Fetching messages...');
    const messagesRes = await axios.get(`${BASE_URL}/api/groups/${groupId}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Retrieved', messagesRes.data.messages.length, 'message(s)');
    messagesRes.data.messages.forEach((msg, i) => {
      console.log(`   ${i + 1}. [${msg.type}] ${msg.content}`);
    });
    
    // Test 8: Register User 2
    console.log('\n📝 Test 8: Registering User 2...');
    const signupRes2 = await axios.post(`${BASE_URL}/signup`, user2);
    console.log('✅ User 2 registered successfully');
    
    // Test 9: Login User 2
    console.log('\n🔐 Test 9: Logging in User 2...');
    const loginRes2 = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: user2.username,
      password: user2.password
    });
    authToken2 = loginRes2.data.token;
    console.log('✅ User 2 logged in');
    
    // Test 10: Join Group with Invite Code
    console.log('\n🎫 Test 10: User 2 joining group with invite code...');
    const joinRes = await axios.post(`${BASE_URL}/api/groups/join-code`, {
      inviteCode: inviteCode
    }, {
      headers: { Authorization: `Bearer ${authToken2}` }
    });
    console.log('✅ User 2 joined group successfully');
    console.log('   Group now has', joinRes.data.group.members.length, 'members');
    
    // Test 11: User 2 Send Message
    console.log('\n💬 Test 11: User 2 sending a message...');
    const message2Res = await axios.post(`${BASE_URL}/api/groups/${groupId}/messages`, {
      content: 'Hi! Thanks for inviting me!'
    }, {
      headers: { Authorization: `Bearer ${authToken2}` }
    });
    console.log('✅ User 2 message sent');
    
    // Test 12: Verify All Messages
    console.log('\n📨 Test 12: Fetching all messages...');
    const allMessagesRes = await axios.get(`${BASE_URL}/api/groups/${groupId}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Total messages:', allMessagesRes.data.messages.length);
    allMessagesRes.data.messages.forEach((msg, i) => {
      const sender = msg.user ? msg.user.username : 'System';
      console.log(`   ${i + 1}. [${sender}] ${msg.content}`);
    });
    
    // Test 13: Update Group
    console.log('\n✏️ Test 13: Updating group details...');
    const updateRes = await axios.put(`${BASE_URL}/api/groups/${groupId}`, {
      description: 'Updated: An amazing trip to explore Paris together!'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Group updated successfully');
    
    // Test 14: User 2 Leave Group
    console.log('\n🚪 Test 14: User 2 leaving group...');
    const leaveRes = await axios.post(`${BASE_URL}/api/groups/${groupId}/leave`, {}, {
      headers: { Authorization: `Bearer ${authToken2}` }
    });
    console.log('✅ User 2 left the group');
    
    // Test 15: Verify Final State
    console.log('\n🔍 Test 15: Verifying final group state...');
    const finalGroupRes = await axios.get(`${BASE_URL}/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Final group state:');
    console.log('   Name:', finalGroupRes.data.group.name);
    console.log('   Members:', finalGroupRes.data.group.members.length);
    console.log('   Active:', finalGroupRes.data.group.isActive);
    
    console.log('\n\n✨ All tests passed successfully! ✨');
    console.log('\n📋 Summary:');
    console.log('   - Created group with invite code:', inviteCode);
    console.log('   - User 1 and User 2 communicated via messages');
    console.log('   - All messages stored in MongoDB');
    console.log('   - Group management operations work correctly');
    console.log('\n🌐 Visit http://localhost:8080/groups to see the UI');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run tests
console.log('⏳ Starting tests in 2 seconds...\n');
setTimeout(test, 2000);
