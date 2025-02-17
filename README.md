  // Effects
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userData?.id) {
          console.error('User ID is missing');
          return;
        }

        const userId = userData.id.toString();
        const userFirestoreData = await getUserData(userId);

        if (userFirestoreData) {
          setBalance(userFirestoreData.balance);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userData]);