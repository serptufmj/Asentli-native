import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ onLogout }) {
  const [faceId, setFaceId] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>YOUR PROFILE</Text>
        </View>
        <View style={styles.content}>

          <View style={styles.profileCard}>

            <Image
              source={require('../../assets/profile.jpg')}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.name}>Angy Díaz</Text>
              <Text style={styles.email}>Mari120@hotmail.com</Text>
            </View>

          </View>

          <View style={styles.menuCard}>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#7A827F"
                />

                <Text style={styles.menuText}>Account</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#999"
              />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="card-outline"
                  size={21}
                  color="#7A827F"
                />

                <Text style={styles.menuText}>Billing</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#999"
              />
            </TouchableOpacity>

          </View>


          <View style={styles.menuCard}>

            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="scan-outline"
                  size={21}
                  color="#7A827F"
                />

                <Text style={styles.menuText}>Face ID</Text>
              </View>

              <Switch
                value={faceId}
                onValueChange={setFaceId}
                trackColor={{
                  false: '#D0D0D0',
                  true: '#999999',
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.separator} />


            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#7A827F"
                />

                <Text style={styles.menuText}>Password</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#999"
              />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="settings-outline"
                  size={21}
                  color="#7A827F"
                />

                <Text style={styles.menuText}>Settings</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#999"
              />
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={onLogout}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.bottomBar}>

          <TouchableOpacity style={styles.bottomItem}>
            <Ionicons
              name="home-outline"
              size={21}
              color="#8BA59D"
            />
            <Text style={styles.bottomText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomItem}>
            <Ionicons
              name="stats-chart-outline"
              size={21}
              color="#8BA59D"
            />
            <Text style={styles.bottomText}>Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomItem}>
            <Ionicons
              name="basket-outline"
              size={21}
              color="#8BA59D"
            />
            <Text style={styles.bottomText}>Basket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomItem}>
            <Ionicons
              name="person-outline"
              size={21}
              color="#FFFFFF"
            />
            <Text style={styles.bottomTextActive}>Profile</Text>

            <View style={styles.activeDot} />
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E7FFD0',
  },

  container: {
    flex: 1,
    backgroundColor: '#E7FFD0',
  },

  header: {
    height: 45,
    backgroundColor: '#8FA69F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#003F32',
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
    alignItems: 'center',
  },

  profileCard: {
    width: '88%',
    height: 118,
    backgroundColor: '#E9E7E6',
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 43,
  },

  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginRight: 13,
  },

  profileInfo: {
    justifyContent: 'center',
  },

  name: {
    fontSize: 21,
    fontWeight: '800',
    color: '#003F32',
    marginBottom: 7,
  },

  email: {
    fontSize: 10,
    color: '#666666',
    textDecorationLine: 'underline',
  },

  menuCard: {
    width: '88%',
    backgroundColor: '#F6F6F6',
    borderRadius: 19,
    overflow: 'hidden',
    marginBottom: 58,
  },

  menuItem: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    fontSize: 13,
    color: '#40504B',
    fontWeight: '500',
    marginLeft: 11,
  },

  separator: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginHorizontal: 12,
  },
  signOutButton: {
    width: '88%',
    height: 57,
    borderRadius: 30,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  signOutText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  bottomBar: {
    height: 54,
    backgroundColor: '#004735',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 50,
  },

  bottomText: {
    fontSize: 9,
    color: '#8BA59D',
    marginTop: 2,
  },

  bottomTextActive: {
    fontSize: 9,
    color: '#FFFFFF',
    marginTop: 2,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6A00',
    marginTop: 2,
  },
});