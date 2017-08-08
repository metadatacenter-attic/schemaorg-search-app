'use strict';

angular.module("settings")

.constant("UserProfiles",
  { default: {
      name: "default",
      label: "Default Profile",
      apiKey: "",
      searchEngineId: "",
      pageLimit: 10
    }
  });
