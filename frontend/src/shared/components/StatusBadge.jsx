const StatusBadge = ({ status }) => {
    const getBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'badge badge-pending';
            case 'approved': return 'badge badge-approved';
            case 'rejected': return 'badge badge-rejected';
            case 'available': return 'badge badge-available';
            case 'adopted': return 'badge badge-adopted';
            default: return 'badge';
        }
    };

    return (
        <span className={getBadgeClass(status)}>
            {status}
        </span>
    );
};

export default StatusBadge;
