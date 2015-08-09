package streama

import grails.transaction.Transactional

@Transactional
class DefaultDataService {

  def createDefaultRoles(){
    def roles = [
      [authority: "ROLE_ADMIN", displayName: "Admin"],
      [authority: "ROLE_CONTENT_MANAGER", displayName: "Content Manager"],
    ]

    roles.each { role ->
      def roleInstance = Role.findOrCreateByAuthority(role.authority)
      roleInstance.properties = role
      roleInstance.save flush: true, failOnError: true
    }
  }


  def createDefaultUsers(){
    def users = [
        [
            username: 'admin',
            password: 'admin',
            enabled: true,
            roles: [Role.findByAuthority("ROLE_ADMIN"), Role.findByAuthority("ROLE_CONTENT_MANAGER")]
        ]
    ]

    users.each{ userData ->
      if(!User.findByUsername(userData.username)){
        def user = new User(username: userData.username, password: userData.password, enabled: userData.enabled)
        user.save flush: true, failOnError: true

        userData.roles?.each{ role ->
          UserRole.create(user, role)
        }
      }
    }
  }


  def createDefaultSettings(){
    def settings = [
        [
            settingsKey: 'Upload Directory',
            description: 'This setting provides the application with your desired upload-path for all files. ' +
              'The default so far has been /data/streama. Remember: if you change this path, copy all the files (that were previously added) into the new directory.',
            required: true
        ],
        [
            settingsKey: 'TheMovieDB API key',
            description: 'This API-key is required by the application to fetch all the nice Movie/Episode/Show data for you. Get one for free at https://www.themoviedb.org/',
            required: true
        ],
        [
            settingsKey: 'Base URL',
            value: 'http://localhost:8080/streama',
            description: 'The Base-URL is used for the videos and the link in the invitation-email.',
            required: true
        ],
    ]

    settings.each{ settingData ->
      if(!Settings.findBySettingsKey(settingData.settingsKey)){
        def setting = new Settings(settingData)
        setting.save flush: true, failOnError: true
      }
    }
  }
}
