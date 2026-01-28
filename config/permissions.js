module.exports = {
    ADMIN: ['*'],
    MANAGER: [
        'USER_CREATE',
        'USER_VIEW',
        'CLASS_ASSIGN'
    ],
    TRAINER: [
        'CLASS_VIEW',
        'CLASS_UPDATE',
        'ATTENDANCE_MARK',
        'CONTENT_UPLOAD'
    ],
    TA: [
        'CLASS_VIEW',
        'CLASS_UPDATE',
        'ATTENDANCE_MARK',
        'CONTENT_UPLOAD'
    ]
};