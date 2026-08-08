package com.expensetracker.service;

import com.expensetracker.dto.profile.ProfileResponse;
import com.expensetracker.dto.profile.ProfileUpdateRequest;

public interface ProfileService {

    ProfileResponse getProfile();

    ProfileResponse updateProfile(ProfileUpdateRequest request);

}