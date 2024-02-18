import { NavLink, useParams } from '@remix-run/react';
import AutomationCard from '~/components/AutomationCard';
import { AUTOMATION_LIST } from './constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Automation() {
  const params = useParams();
  const { businessId } = params;

  return (
    <div className='flex-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Automation</h2>
      </div>
      <Tabs defaultValue='overview' className='mt-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='analytics' disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value='reports' disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value='notifications' disabled>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4'>
            {AUTOMATION_LIST.map((automation) => (
              <NavLink
                to={`/app/businesses/${businessId}/automation/${automation.to}`}
                key={automation.to}
                onClick={(e) =>
                  automation.status === 'deactive' && e.preventDefault()
                }
              >
                <AutomationCard
                  title={automation.title}
                  contentText={automation.contentText}
                  description={automation.description}
                  icon={automation.icon}
                  disabled={automation.status === 'deactive'}
                />
              </NavLink>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Automation;
