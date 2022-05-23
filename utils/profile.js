export const profileName = document.getElementById('profileName')
export const profileGender = document.getElementById('profileGender')
export const profileCountry = document.getElementById('profileCountry')

export function renderProfileData(data) {
    if (!data) return
    data.name ? profileName.innerHTML = "Name:     " + data.name : profileName.innerHTML = "Name:     "
    // profileName.innerHTML = "Name: " + profileData.name
    data.gender ? profileGender.innerHTML = "Gender:     " + data.gender : profileGender.innerHTML = "Gender:     "
    data.country ? profileCountry.innerHTML = "Country:     " + data.country : profileCountry.innerHTML = "Country:     "
}

