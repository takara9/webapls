package io.openliberty.guides.rest;

import javax.enterprise.context.ApplicationScoped;

import java.lang.management.MemoryMXBean;
import java.lang.management.ManagementFactory;

import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;

@Liveness
@ApplicationScoped
public class SystemLivenessCheck implements HealthCheck {

    @Override
    public HealthCheckResponse call() {
        MemoryMXBean memBean = ManagementFactory.getMemoryMXBean();
        long memUsed = memBean.getHeapMemoryUsage().getUsed();
        long memMax = memBean.getHeapMemoryUsage().getMax();

	//UpTime xx = new UpTime();
	//System.out.println("up time = " + xx.getUpTime());

        return HealthCheckResponse.named(
            //SystemResource.class.getSimpleName() + " Liveness Check")
            " Liveness Check").withData("memory used", memUsed)
                              .withData("memory max", memMax)
                              .status(memUsed < memMax * 0.9).build();
    }

}
